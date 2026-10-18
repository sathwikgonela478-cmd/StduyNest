(function () {
  'use strict';

  const data = window.LEARNING_DATA;
  const app = document.getElementById('appContent');
  const statusBox = document.getElementById('statusMessage');
  const globalSearch = document.getElementById('globalSearch');
  const sidebarSearch = document.getElementById('sidebarSearch');
  const sidebarNav = document.getElementById('lessonNavigation');
  const sidebarProgress = document.getElementById('sidebarProgress');
  const themeToggle = document.getElementById('themeToggle');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const lessonIds = new Set(Object.keys(data.lessons));
  const lessonOrder = data.groups.flatMap(function (group) { return group.lessonIds; });
  const storageWarnings = [];
  let currentRoute;
  let statusTimer;
  let editorRun = 0;
  let editorState = null;
  // Track active practice workers so navigation can stop them safely.
  const activePracticeTests = new Map();
  let filterState = { text: '', group: 'all', level: 'all', bookmarked: false };

  function create(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined && text !== null) item.textContent = text;
    return item;
  }

  function append(parent, children) {
    children.forEach(function (child) {
      if (child) parent.append(child);
    });
    return parent;
  }

  function button(label, action, className) {
    const item = create('button', className || 'btn btn-secondary', label);
    item.type = 'button';
    item.dataset.action = action;
    return item;
  }

  function routeLink(label, route, className) {
    const item = create('a', className || '', label);
    item.href = routeHref(route);
    item.dataset.route = JSON.stringify(route);
    return item;
  }

  function routeHref(route) {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    if (route.lesson) url.searchParams.set('lesson', route.lesson);
    else if (route.view && route.view !== 'home') url.searchParams.set('view', route.view);
    return url.pathname + url.search + url.hash;
  }

  function notify(message, isError) {
    window.clearTimeout(statusTimer);
    statusBox.textContent = message;
    statusBox.classList.toggle('error', Boolean(isError));
    statusBox.classList.add('visible');
    statusTimer = window.setTimeout(function () {
      statusBox.classList.remove('visible');
    }, 5000);
  }

  function validIdArray(value) {
    return Array.isArray(value) && value.every(function (id) {
      return typeof id === 'string' && lessonIds.has(id);
    }) && new Set(value).size === value.length;
  }

  function readStored(key, validate, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = JSON.parse(raw);
      if (validate(parsed)) return parsed;
      storageWarnings.push('Saved "' + key + '" data was invalid and was not used.');
    } catch (error) {
      storageWarnings.push('Could not read saved "' + key + '" data: ' + error.message);
    }
    return fallback;
  }

  function saveStored(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      notify('Could not save your changes in this browser: ' + error.message, true);
      return false;
    }
  }

  const completed = new Set(readStored('jsnotes-completed', validIdArray, []));
  const bookmarks = new Set(readStored('jsnotes-bookmarks', validIdArray, []));
  const quizAnswers = readStored('projectx-quiz-answers', function(value){
    return value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(function(id){return lessonIds.has(id)&&value[id]&&typeof value[id]==='object'&&!Array.isArray(value[id])&&Object.keys(value[id]).every(function(k){return /^\d+$/.test(k)&&typeof value[id][k]==='boolean';});});
  }, {});
  const quizScores = readStored('jsnotes-quiz-scores', function (value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value) &&
      Object.keys(value).every(function (id) {
        return lessonIds.has(id) && Number.isInteger(value[id]) && value[id] >= 0 && value[id] <= 100;
      });
  }, {});
  let theme = readStored('jsnotes-theme', function (value) {
    return value === 'dark' || value === 'light';
  }, 'dark');
  let editorSaved = readStored('jsnotes-editor', function (value) {
    return value !== null && typeof value === 'object' &&
      typeof value.code === 'string' && value.code.length <= 100000 &&
      typeof value.original === 'string' && value.original.length <= 100000 &&
      ['side', 'below'].includes(value.layout) &&
      Number.isFinite(value.size) && value.size >= 20 && value.size <= 80;
  }, null);

  function persistSet(key, values) {
    saveStored(key, Array.from(values));
  }

  function updateProgressUi() {
    sidebarProgress.textContent = completed.size + ' of ' + lessonOrder.length + ' complete';
  }

  function setTheme(nextTheme, shouldSave) {
    theme = nextTheme;
    document.body.classList.toggle('light', theme === 'light');
    themeToggle.textContent = theme === 'light' ? '☀️ Light' : '🌙 Dark';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    if (shouldSave) saveStored('jsnotes-theme', theme);
  }

  function findGroup(lessonId) {
    return data.groups.find(function (group) { return group.lessonIds.includes(lessonId); });
  }

  function renderSidebar(filter) {
    const query = (filter || '').trim().toLowerCase();
    sidebarNav.replaceChildren();
    data.groups.forEach(function (group) {
      const matching = group.lessonIds.filter(function (id) {
        const lesson = data.lessons[id];
        return (lesson.title + ' ' + lesson.intro + ' ' + group.title).toLowerCase().includes(query);
      });
      if (!matching.length) return;
      const section = create('section', 'sidebar-group');
      section.append(create('h3', '', group.title));
      matching.forEach(function (id) {
        const link = routeLink(data.lessons[id].title, { lesson: id });
        if (currentRoute && currentRoute.lesson === id) link.classList.add('active');
        if (completed.has(id)) {
          const check = create('span', 'sidebar-check', '✓');
          check.setAttribute('aria-label', 'Completed');
          link.append(check);
        }
        section.append(link);
      });
      sidebarNav.append(section);
    });
  }

  function readRoute() {
    const params = new URLSearchParams(window.location.search);
    const queryLesson = params.get('lesson');
    let hashLesson = '';
    try {
      hashLesson = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    } catch (error) {
      notify('That lesson link contains an invalid address. Showing the course home page.', true);
    }
    if (queryLesson && lessonIds.has(queryLesson)) return { lesson: queryLesson };
    if (hashLesson && lessonIds.has(hashLesson)) return { lesson: hashLesson };
    if (queryLesson || (hashLesson && hashLesson !== 'top')) {
      notify('That lesson link is not recognized. Showing the course home page.', true);
    }
    const view = params.get('view');
    if (['projects', 'tryit', 'practice', 'visualizer', 'predict', 'debug', 'interview', 'security'].includes(view)) return { view: view };
    return { view: 'home' };
  }

  function stopActivePracticeTests() {
    activePracticeTests.forEach(function (test, token) {
      if (test.timer) window.clearTimeout(test.timer);
      if (test.worker) test.worker.terminate();
      if (test.workerUrl) URL.revokeObjectURL(test.workerUrl);
      activePracticeTests.delete(token);
      if (test.status && test.status.isConnected) {
        test.status.textContent = 'Practice run stopped because you left this page.';
        test.status.className = 'muted practice-status';
      }
    });
  }

  function navigate(route, replace) {
    stopActivePracticeTests();
    if (currentRoute && currentRoute.view === 'visualizer' && route.view !== 'visualizer') stopVisualizerWorker();
    const href = routeHref(route);
    const url = new URL(href, window.location.href);
    if (replace) window.history.replaceState({}, '', url);
    else window.history.pushState({}, '', url);
    currentRoute = route;
    document.body.classList.remove('sidebar-open', 'code-fullscreen');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    sidebarBackdrop.hidden = true;
    render();
    window.scrollTo(0, 0);
  }

  function syntaxMarkup(text) {
    const pattern = /<\/?[A-Za-z][\w:-]*(?:\s+[A-Za-z_:][\w:.-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*\s*\/?>|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/[^\n]*|\/\*[\s\S]*?\*\/|\b(?:const|let|var|function|return|if|else|switch|case|break|for|while|do|class|extends|super|new|this|try|catch|finally|throw|async|await|import|export|from|default|of|in|typeof|instanceof|delete|void|yield|throw|continue)\b|\b(?:true|false|null|undefined|NaN|Infinity)\b|\b(?:console|document|window|Math|JSON|Array|Object|String|Number|Promise|Set|Map|Date|RegExp|Error|fetch|Intl|Symbol|BigInt)\b|\b\d+(?:\.\d+)?\b|===?|!==?|=>|&&|\|\||\?\?|\?\.|[+\-*\/%]=?|[<>]=?|[{}()[\].,:;]+/g;
    const fragment = document.createDocumentFragment();
    let previous = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > previous) fragment.append(document.createTextNode(text.slice(previous, match.index)));
      const token = match[0];
      let kind = '';
      if (/^<\/?[A-Za-z]/.test(token)) kind = 'tag';
      else if (/^(["'`])/.test(token)) kind = 'string';
      else if (/^(\/\/|\/\*)/.test(token)) kind = 'comment';
      else if (/^\d/.test(token)) kind = 'number';
      else if (/^(true|false|null|undefined|NaN|Infinity)$/.test(token)) kind = 'literal';
      else if (/^(console|document|window|Math|JSON|Array|Object|String|Number|Promise|Set|Map|Date|RegExp|Error|fetch|Intl|Symbol|BigInt)$/.test(token)) kind = 'built-in';
      else if (/^(===?|!==?|=>|&&|\|\||\?\?|\?\.|[+\-*\/%]=?|[<>]=?)$/.test(token)) kind = 'operator';
      else kind = 'keyword';
      const span = create('span', 'syntax-' + kind);
      span.textContent = token;
      fragment.append(span);
      previous = pattern.lastIndex;
    }
    if (previous < text.length) fragment.append(document.createTextNode(text.slice(previous)));
    return fragment;
  }

  function codeBlock(code) {
    const pre = create('pre');
    pre.append(syntaxMarkup(code));
    return pre;
  }

  function cardLink(id) {
    return routeLink(data.lessons[id].title, { lesson: id }, 'lesson-card');
  }

  function lessonCard(id) {
    const lesson = data.lessons[id];
    const group = findGroup(id);
    const card = routeLink('', { lesson: id }, 'lesson-card');
    card.setAttribute('aria-label', 'Open lesson: ' + lesson.title);
    card.append(create('span', 'badge', group.level));
    card.append(create('h3', '', lesson.title));
    card.append(create('p', '', lesson.intro));
    const footer = create('div', 'lesson-card-footer');
    footer.append(create('span', 'tag', group.title));
    footer.append(create('span', 'muted', completed.has(id) ? 'Completed ✓' : 'Open lesson →'));
    card.append(footer);
    return card;
  }

  function renderHome() {
    app.replaceChildren();
    const hero = create('section', 'hero');
    const intro = create('div');
    intro.append(create('span', 'eyebrow', 'Learn JavaScript step by step'));
    intro.append(create('h1', '', 'JavaScript, from your first line to advanced topics'));
    intro.append(create('p', 'lead', 'Start with no programming experience. Follow structured lessons, run complete examples, check your understanding, and track your progress as you learn.'));
    const actions = create('div', 'hero-actions');
    actions.append(routeLink(completed.size ? 'Continue learning' : 'Start with lesson one', { lesson: completed.size && lessonIds.has(readStored('jsnotes-last-lesson', function (id) { return typeof id === 'string' && lessonIds.has(id); }, 'intro')) ? readStored('jsnotes-last-lesson', function (id) { return typeof id === 'string' && lessonIds.has(id); }, 'intro') : 'intro' }, 'btn btn-primary'));
    actions.append(routeLink('Open Tryit editor', { view: 'tryit' }, 'btn btn-secondary'));
    intro.append(actions);
    const tags = create('div', 'mini-tags');
    ['54 lessons', 'Beginner to advanced', 'Quizzes and exercises', 'Progress saved on this device'].forEach(function (label) {
      tags.append(create('span', '', label));
    });
    intro.append(tags);
    const example = create('div', 'hero-example');
    const dots = create('div', 'window-dots');
    dots.append(create('span'), create('span'), create('span'));
    example.append(dots);
    example.append(codeBlock('const name = "Learner";\nconsole.log(`Hello, ${name}!`);'));
    hero.append(intro, example);
    app.append(hero);

    const stats = create('section', 'stats-grid');
    [
      [String(lessonOrder.length), 'Lessons'],
      [String(data.groups.length), 'Learning paths'],
      [String(completed.size), 'Lessons completed'],
      [String(bookmarks.size), 'Bookmarked']
    ].forEach(function (entry) {
      const item = create('div', 'stat-card');
      item.append(create('span', 'stat-value', entry[0]), create('span', 'stat-label', entry[1]));
      stats.append(item);
    });
    app.append(stats);

    const scores = Object.keys(quizScores).map(function(id){return quizScores[id];});
    const averageScore = scores.length ? Math.round(scores.reduce(function(sum,score){return sum+score;},0)/scores.length) : null;
    const weakLessons = Object.keys(quizScores).filter(function(id){return quizScores[id] < 70 && data.lessons[id];}).slice(0,3);
    const snapshot = create('section','panel learning-snapshot');
    snapshot.append(create('h2','','Your learning snapshot'));
    const snapshotGrid = create('div','snapshot-grid');
    snapshotGrid.append(create('div','snapshot-item'),create('div','snapshot-item'),create('div','snapshot-item'));
    snapshotGrid.children[0].append(create('span','snapshot-value',Math.max(0,lessonOrder.length-completed.size)),create('span','snapshot-label','Lessons remaining'));
    snapshotGrid.children[1].append(create('span','snapshot-value',averageScore===null?'—':averageScore+'%'),create('span','snapshot-label','Average saved quiz score'));
    snapshotGrid.children[2].append(create('span','snapshot-value',scores.length),create('span','snapshot-label','Lessons with quiz attempts'));
    snapshot.append(snapshotGrid);
    const weakWrap=create('div','weak-topics'); weakWrap.append(create('h3','','Topics to revisit'));
    if(weakLessons.length){weakLessons.forEach(function(id){weakWrap.append(routeLink(data.lessons[id].title,{lesson:id},'tag'));});}
    else weakWrap.append(create('p','muted',scores.length?'No low quiz scores saved. Keep practising!':'Take lesson quizzes to discover which topics need revision.'));
    snapshot.append(weakWrap); app.append(snapshot);

    const hub = create('section', 'section feature-hub');
    const hubHeading = create('div', 'section-heading');
    hubHeading.append(create('div'));
    hubHeading.firstChild.append(create('h2', '', 'Practice beyond reading'));
    hubHeading.firstChild.append(create('p', '', 'Learn by solving, predicting, debugging, and building.'));
    hub.append(hubHeading);
    const hubGrid = create('div', 'feature-grid');
    [
      ['practice', 'Coding practice', 'Solve challenges with hints and starter code.', 'Code'],
      ['visualizer', 'Code visualizer', 'Step through loops and watch values change.', 'Steps'],
      ['predict', 'Predict the output', 'Think first, then reveal the result and explanation.', 'Quiz'],
      ['debug', 'Debugging lab', 'Find and fix common JavaScript mistakes.', 'Debug'],
      ['interview', 'Interview prep', 'Review JavaScript questions by topic.', 'Review'],
      ['security', 'Web security lab', 'Explore safe DOM updates and input handling.', 'Secure']
    ].forEach(function (item) {
      const card = create('article', 'feature-card');
      card.append(create('span', 'badge', item[3]));
      card.append(create('h3', '', item[1]));
      card.append(create('p', '', item[2]));
      card.append(routeLink('Open ' + item[1] + ' →', { view: item[0] }, 'btn btn-secondary'));
      hubGrid.append(card);
    });
    hub.append(hubGrid);
    app.append(hub);

    const catalog = create('section', 'section');
    const heading = create('div', 'section-heading');
    const headingText = create('div');
    headingText.append(create('h2', '', 'Browse all lessons'));
    headingText.append(create('p', '', 'Use search and filters to find a topic. Lessons are grouped in a recommended learning order.'));
    heading.append(headingText);
    const reset = button('Reset learning progress', 'reset-progress', 'btn btn-quiet');
    heading.append(reset);
    catalog.append(heading);
    const controls = create('div', 'catalog-controls');
    const search = create('input');
    search.type = 'search';
    search.id = 'catalogSearch';
    search.placeholder = 'Search lesson topics';
    search.setAttribute('aria-label', 'Search lesson topics');
    search.value = filterState.text;
    const groupSelect = create('select');
    groupSelect.id = 'catalogGroup';
    groupSelect.setAttribute('aria-label', 'Filter by learning path');
    [['all', 'All learning paths']].concat(data.groups.map(function (group) {
      return [group.id, group.title];
    })).forEach(function (option) {
      const item = create('option', '', option[1]);
      item.value = option[0];
      groupSelect.append(item);
    });
    groupSelect.value = filterState.group;
    const levelSelect = create('select');
    levelSelect.id = 'catalogLevel';
    levelSelect.setAttribute('aria-label', 'Filter by difficulty');
    [['all', 'All levels'], ['Beginner', 'Beginner'], ['Intermediate', 'Intermediate'], ['Advanced', 'Advanced']].forEach(function (option) {
      const item = create('option', '', option[1]);
      item.value = option[0];
      levelSelect.append(item);
    });
    levelSelect.value = filterState.level;
    const bookmarkLabel = create('label', 'filter-control');
    const bookmarkOnly = create('input');
    bookmarkOnly.type = 'checkbox';
    bookmarkOnly.id = 'catalogBookmarks';
    bookmarkOnly.checked = filterState.bookmarked;
    bookmarkLabel.append(bookmarkOnly, create('span', '', 'Bookmarked only'));
    controls.append(search, groupSelect, levelSelect, bookmarkLabel);
    catalog.append(controls);
    const resultsHeading = create('p', 'muted');
    resultsHeading.id = 'catalogCount';
    catalog.append(resultsHeading);
    const grid = create('div', 'lesson-grid');
    grid.id = 'catalogResults';
    catalog.append(grid);
    app.append(catalog);
    filterState.text = globalSearch.value.trim() || filterState.text;
    search.value = filterState.text;
    renderCatalogResults();
  }

  function renderCatalogResults() {
    const grid = document.getElementById('catalogResults');
    if (!grid) return;
    const query = filterState.text.trim().toLowerCase();
    const results = lessonOrder.filter(function (id) {
      const lesson = data.lessons[id];
      const group = findGroup(id);
      return (filterState.group === 'all' || filterState.group === group.id) &&
        (filterState.level === 'all' || filterState.level === group.level) &&
        (!filterState.bookmarked || bookmarks.has(id)) &&
        (!query || (lesson.title + ' ' + lesson.intro + ' ' + group.title).toLowerCase().includes(query));
    });
    grid.replaceChildren();
    results.forEach(function (id) { grid.append(lessonCard(id)); });
    document.getElementById('catalogCount').textContent = 'Showing ' + results.length + ' of ' + lessonOrder.length + ' lessons';
    if (!results.length) grid.append(create('p', 'empty-state', 'No lessons match these filters. Try a broader search or reset a filter.'));
  }

  function renderLesson(lessonId) {
    const lesson = data.lessons[lessonId];
    const group = findGroup(lessonId);
    if (!lesson || !group) {
      navigate({ view: 'home' }, true);
      return;
    }
    app.replaceChildren();
    const heading = create('header', 'page-heading');
    heading.append(create('span', 'eyebrow', group.title));
    heading.append(create('h1', '', lesson.title));
    heading.append(create('p', 'lesson-intro lead', lesson.intro));
    const meta = create('div', 'lesson-meta');
    meta.append(create('span', 'tag', group.level));
    meta.append(create('span', 'tag', 'Lesson ' + (lessonOrder.indexOf(lessonId) + 1) + ' of ' + lessonOrder.length));
    heading.append(meta);
    app.append(heading);

    const groupObjectives = create('section', 'lesson-objectives panel');
    groupObjectives.append(create('h2', '', 'What you will learn in this section'));
    const objectiveList = create('ul');
    group.objectives.forEach(function (objective) { objectiveList.append(create('li', '', objective)); });
    groupObjectives.append(objectiveList);
    app.append(groupObjectives);
    if (lessonOrder.indexOf(lessonId) > 0) {
      const previous = data.lessons[lessonOrder[lessonOrder.indexOf(lessonId) - 1]];
      const prerequisite = create('p', 'lesson-prerequisite muted', 'Recommended previous lesson: ');
      prerequisite.append(routeLink(previous.title, { lesson: lessonOrder[lessonOrder.indexOf(lessonId) - 1] }));
      app.append(prerequisite);
    }
    const status = create('div', 'lesson-status');
    const completeButton = button(completed.has(lessonId) ? 'Completed ✓' : 'Mark lesson complete', 'toggle-complete', 'btn btn-quiet complete-button');
    completeButton.dataset.lesson = lessonId;
    completeButton.setAttribute('aria-pressed', String(completed.has(lessonId)));
    const bookmarkButton = button(bookmarks.has(lessonId) ? 'Bookmarked ★' : 'Bookmark lesson ☆', 'toggle-bookmark', 'btn btn-quiet bookmark-button');
    bookmarkButton.dataset.lesson = lessonId;
    bookmarkButton.setAttribute('aria-pressed', String(bookmarks.has(lessonId)));
    status.append(completeButton, bookmarkButton);
    app.append(status);

    lesson.sections.forEach(function (section, index) {
      const topic = create('article', 'topic-card');
      topic.append(create('h2', '', section[0]));
      topic.append(create('p', '', section[1]));
      if (section[2]) {
        const example = create('div', 'example-card');
        example.append(create('div', 'example-title', 'Complete runnable example'));
        example.append(codeBlock(section[2]));
        if (section[3]) {
          const output = create('div', 'expected-output');
          output.append(create('h3', '', 'Expected result'));
          output.append(create('pre', '', section[3]));
          example.append(output);
        }
        if (section[4]) example.append(create('p', 'example-explanation', section[4]));
        const actions = create('div', 'example-actions');
        const runExample = button('Try this code', 'try-example', 'btn btn-primary');
        runExample.dataset.lesson = lessonId;
        runExample.dataset.section = String(index);
        actions.append(runExample);
        example.append(actions);
        topic.append(example);
      }
      app.append(topic);
    });

    const quizList = data.quizzes[lessonId];
    if (quizList && quizList.length) {
      quizList.forEach(function (quiz, index) {
        const card = create('section', 'quiz-card');
        card.append(create('h2', '', 'Quick quiz'));
        card.append(create('p', '', quiz.question));
        const options = create('div', 'quiz-options');
        quiz.choices.forEach(function (choice, choiceIndex) {
          const label = create('label', 'quiz-option');
          const radio = create('input');
          radio.type = 'radio';
          radio.name = 'quiz-' + lessonId + '-' + index;
          radio.value = String(choiceIndex);
          label.append(radio, create('span', '', choice));
          options.append(label);
        });
        card.append(options);
        const feedback = create('p', 'quiz-feedback');
        feedback.id = 'quiz-feedback-' + lessonId + '-' + index;
        feedback.setAttribute('aria-live', 'polite');
        const submit = button('Check answer', 'submit-quiz', 'btn btn-secondary');
        submit.dataset.lesson = lessonId;
        submit.dataset.quiz = String(index);
        submit.dataset.answer = String(quiz.answer);
        submit.dataset.explanation = quiz.explanation;
        submit.dataset.feedback = feedback.id;
        card.append(submit, feedback);
        if (quizScores[lessonId] !== undefined) card.append(create('p', 'muted', 'Saved lesson quiz score: ' + quizScores[lessonId] + '%'));
        app.append(card);
      });
    }

    const exercise = data.exercises[lessonId];
    if (exercise) {
      const card = create('section', 'exercise-card');
      card.append(create('h2', '', 'Practice exercise'));
      card.append(create('p', '', exercise.task));
      card.append(create('pre', '', exercise.starter));
      card.append(button('Open starter in Tryit', 'try-exercise', 'btn btn-primary'));
      const starterButton = card.querySelector('[data-action="try-exercise"]');
      starterButton.dataset.lesson = lessonId;
      app.append(card);
    }

    const orderIndex = lessonOrder.indexOf(lessonId);
    const nav = create('nav', 'lesson-navigation-buttons');
    nav.setAttribute('aria-label', 'Previous and next lessons');
    if (orderIndex > 0) nav.append(routeLink('← ' + data.lessons[lessonOrder[orderIndex - 1]].title, { lesson: lessonOrder[orderIndex - 1] }, 'btn btn-secondary'));
    else nav.append(create('span'));
    if (orderIndex < lessonOrder.length - 1) nav.append(routeLink(data.lessons[lessonOrder[orderIndex + 1]].title + ' →', { lesson: lessonOrder[orderIndex + 1] }, 'btn btn-primary'));
    else nav.append(routeLink('Back to all lessons', { view: 'home' }, 'btn btn-primary'));
    app.append(nav);
    saveStored('jsnotes-last-lesson', lessonId);
    renderSidebar(sidebarSearch.value);
  }

  const practiceProblems = [
    { title: 'Filter passing students', level: 'Easy', topic: 'Arrays', task: 'Create a new array containing only marks greater than or equal to 50.', starter: 'const marks = [35, 82, 48, 91, 67];\n// Create and log an array containing only passing marks\n', checks: ['filter', 'console.log'], hint: 'Use marks.filter(mark => mark >= 50).', solution: 'const marks = [35, 82, 48, 91, 67];\nconst passed = marks.filter(mark => mark >= 50);\nconsole.log(passed);', output: '[82,91,67]' },
    { title: 'Calculate a shopping total', level: 'Easy', topic: 'Loops', task: 'Add all prices in the array and print the total.', starter: 'const prices = [120, 80, 250, 50];\n// Calculate and log the total\n', checks: ['reduce', 'console.log'], hint: 'Array reduce() can accumulate all prices.', solution: 'const prices = [120, 80, 250, 50];\nconst total = prices.reduce((sum, price) => sum + price, 0);\nconsole.log(total);', output: '500' },
    { title: 'Count vowels', level: 'Medium', topic: 'Strings', task: 'Count vowels in the word "javascript" without counting uppercase/lowercase differently.', starter: 'const word = "javascript";\n// Count vowels and print the count\n', checks: ['aeiou', 'filter', 'length'], hint: 'Convert the word to lowercase, split it into characters, then filter vowels.', solution: 'const word = "javascript".toLowerCase();\nconst count = [...word].filter(char => "aeiou".includes(char)).length;\nconsole.log(count);', output: '3' },
    { title: 'Find the most expensive product', level: 'Medium', topic: 'Objects', task: 'Find and print the name of the product with the highest price.', starter: 'const products = [\n  { name: "Notebook", price: 80 },\n  { name: "Headphones", price: 950 },\n  { name: "Mouse", price: 450 }\n];\n// Find the most expensive product\n', checks: ['reduce', 'price', 'console.log'], hint: 'Use reduce() to keep the product with the greater price.', solution: 'const products = [{name:"Notebook",price:80},{name:"Headphones",price:950},{name:"Mouse",price:450}];\nconst highest = products.reduce((best, item) => item.price > best.price ? item : best);\nconsole.log(highest.name);', output: 'Headphones' },
    { title: 'Guard against invalid division', level: 'Medium', topic: 'Conditions', task: 'Write a function that returns a helpful message instead of dividing by zero.', starter: 'function divide(a, b) {\n  // Validate b, then return the result\n}\nconsole.log(divide(12, 3));\nconsole.log(divide(12, 0));\n', checks: ['if', 'return', '0'], hint: 'If b === 0, return a message before dividing.', solution: 'function divide(a, b) {\n  if (b === 0) return "Cannot divide by zero";\n  return a / b;\n}\nconsole.log(divide(12, 3));\nconsole.log(divide(12, 0));', output: '4\nCannot divide by zero' },
    { title: 'Create a safe message', level: 'Easy', topic: 'DOM & Security', task: 'Explain and use textContent to display user-provided text safely in a webpage.', starter: 'const message = "Welcome, learner!";\nconst output = document.querySelector("#output");\n// Set the output text safely\n', checks: ['textContent'], testType: 'dom', hint: 'Assign message to output.textContent, not innerHTML.', solution: 'const message = "Welcome, learner!";\nconst output = document.querySelector("#output");\noutput.textContent = message;', output: 'Welcome, learner!' }
  ];

  function renderPractice() {
    app.replaceChildren();
    const heading=create('header','page-heading'); heading.append(create('span','eyebrow','Learn by doing'),create('h1','','Coding practice'),create('p','lead','Solve real beginner-to-intermediate problems. Reveal hints when stuck, then open the starter in Tryit and test your solution.')); app.append(heading);
    const grid=create('div','practice-grid');
    practiceProblems.forEach(function(problem,index){
      const card=create('article','panel practice-card'); card.append(create('span','badge',problem.level+' · '+problem.topic),create('h2','',problem.title),create('p','',problem.task));
      const attemptLabel=create('label','practice-attempt-label','Your solution'); const attempt=create('textarea'); attempt.rows=6; attempt.id='practiceAttempt'+index; attempt.setAttribute('aria-label','Your solution for '+problem.title); attempt.placeholder='Write your JavaScript solution here…'; attempt.value=readStored('projectx-practice-attempt-'+index,function(v){return typeof v==='string'&&v.length<=20000;},problem.starter); attemptLabel.append(attempt); card.append(attemptLabel);
      const saveAttempt=button('Save attempt','save-practice-attempt','btn btn-secondary'); saveAttempt.dataset.problem=String(index); card.append(saveAttempt);
      const runTests=button('Run sample tests','run-practice-tests','btn btn-primary'); runTests.dataset.problem=String(index); card.append(runTests);
      const testDetails=create('details','practice-hint');testDetails.append(create('summary','','View expected sample result'),create('pre','',problem.output));card.append(testDetails);
      const hint=create('details','practice-hint'); hint.append(create('summary','','Show hint'),create('p','',problem.hint)); card.append(hint);
      const starter=button('Open starter in Tryit','practice-starter','btn btn-secondary'); starter.dataset.problem=String(index); card.append(starter);
      const solution=button('Reveal solution','practice-solution','btn btn-quiet'); solution.dataset.problem=String(index); card.append(solution);
      const code=create('pre','practice-solution-code'); code.textContent=problem.solution; code.hidden=true; code.id='practiceSolution'+index; card.append(code);
      const result=create('p','muted practice-status','Try the problem, then compare your code with the solution.'); result.id='practiceStatus'+index; card.append(result);
      grid.append(card);
    }); app.append(grid);
  }

  const visualizerExamples = {
    loop: 'const scores = [72, 91, 65];\nlet total = 0;\n\nfor (let i = 0; i < scores.length; i++) {\n  total = total + scores[i];\n  console.log("After score", i + 1, "total =", total);\n}\n\nconst average = total / scores.length;\nconsole.log("Average:", average);',
    function: 'function calculateBill(price, quantity) {\n  const subtotal = price * quantity;\n  const tax = subtotal * 0.05;\n  const total = subtotal + tax;\n  return total;\n}\n\nconst bill = calculateBill(200, 3);\nconsole.log("Final bill:", bill);',
    condition: 'const marks = [82, 46, 67, 35];\nlet passed = 0;\n\nfor (let i = 0; i < marks.length; i++) {\n  if (marks[i] >= 40) {\n    passed++;\n    console.log(marks[i], "passed");\n  } else {\n    console.log(marks[i], "needs practice");\n  }\n}\n\nconsole.log("Students passed:", passed);'
  };
  let visualizerState = { code: readStored('projectx-visualizer-code', function(value){return typeof value === 'string' && value.length <= 50000;}, visualizerExamples.loop), steps: [], index: 0, logs: [], status: 'Paste JavaScript or choose an example, then select Run & trace.', worker: null, timer: null, workerUrl: null };

  function explainJsLine(line) {
    const clean = line.trim();
    if (!clean) return 'This is a blank line. Blank lines separate ideas and make code easier to read.';
    if (/^\/\//.test(clean)) return 'This is a comment for people reading the program. JavaScript ignores it when running the code.';
    if (/^(const|let|var)\s+/.test(clean)) return 'This line creates or declares a variable. The name on the left stores a value, and the expression on the right is evaluated to get that value.';
    if (/^console\.(log|info|warn|error)\s*\(/.test(clean)) return 'This line sends information to the console. It is useful for seeing values while learning and debugging.';
    if (/^for\s*\(/.test(clean)) return 'This is a for loop. It sets up a starting value, checks a condition before each round, and usually updates a counter after each round.';
    if (/^while\s*\(/.test(clean)) return 'This is a while loop. JavaScript repeats its body while the condition inside the parentheses is true.';
    if (/^if\s*\(/.test(clean)) return 'This is a condition. JavaScript checks the expression in parentheses; the block runs only when the result is true.';
    if (/^else\b/.test(clean) || /^}\s*else/.test(clean)) return 'This is the alternative branch. It runs when the related if condition is false.';
    if (/^function\s+/.test(clean) || /=>\s*\{?$/.test(clean)) return 'This line defines a reusable function. The statements inside it run when the function is called.';
    if (/^return\b/.test(clean)) return 'return sends a value back to the code that called the function and ends that function call.';
    if (/\+\+|--/.test(clean)) return 'This line increases or decreases a value by one. Check whether the operator appears before or after the variable because that changes which value an expression returns.';
    if (/^}/.test(clean) || clean === '{') return 'This brace marks the start or end of a code block, such as a loop, condition, or function. It groups statements together.';
    if (/\.push\s*\(/.test(clean)) return 'push() adds a new item to the end of an array. The array can therefore become longer.';
    if (/\.filter\s*\(/.test(clean)) return 'filter() checks each array item and returns a new array containing only items that pass the test.';
    if (/\.map\s*\(/.test(clean)) return 'map() transforms every array item and returns a new array containing the transformed values.';
    if (/^throw\b/.test(clean)) return 'throw deliberately raises an error. JavaScript stops the current path unless the error is caught.';
    if (/^try\b/.test(clean)) return 'try starts a block of code that may fail. A matching catch block can handle an error.';
    if (/^catch\b/.test(clean)) return 'catch receives an error from the matching try block so the program can respond instead of stopping unexpectedly.';
    if (/^await\b/.test(clean) || /\bawait\s/.test(clean)) return 'await pauses this async function until a Promise settles, then gives you its fulfilled value or throws its rejection.';
    if (/^import\b|^export\b/.test(clean)) return 'This is module syntax. It shares code between JavaScript modules and generally needs a module-aware environment.';
    if (/^[\w.$\[\]]+\s*(\+=|-=|\*=|\/=|=)\s*/.test(clean)) return 'This line updates a variable or property. JavaScript evaluates the expression on the right, then stores the result on the left.';
    if (/^\w[\w$]*\s*\(/.test(clean)) return 'This line calls a function. The values inside parentheses are arguments passed into that function.';
    return 'JavaScript executes this statement in order. Read the active line from left to right, then check the variable table and console to see its effect.';
  }

  function stopVisualizerWorker() {
    if (visualizerState.timer) window.clearTimeout(visualizerState.timer);
    if (visualizerState.worker) visualizerState.worker.terminate();
    if (visualizerState.workerUrl) URL.revokeObjectURL(visualizerState.workerUrl);
    visualizerState.timer = null; visualizerState.worker = null; visualizerState.workerUrl = null;
  }

  function renderVisualizer() {
    app.replaceChildren();
    const heading = create('header', 'page-heading');
    heading.append(create('span', 'eyebrow', 'Understand code, not just output'), create('h1', '', 'Advanced code visualizer'), create('p', 'lead', 'Paste beginner-level JavaScript, run it in an isolated worker, and step through the recorded execution. See the active line, variable values, console output, and a plain-English explanation.'));
    app.append(heading);
    const notice = create('div', 'callout warning');
    notice.textContent = 'Best support: one JavaScript statement per line, ordinary variables, functions, arrays, if/else, and loops with braces. This is a teaching tracer, not a full JavaScript debugger: minified code, complex multiline expressions, modules, browser DOM code, and some advanced syntax may not trace accurately. Code runs in a worker and is stopped after 2.5 seconds.';
    app.append(notice);
    const workspace = create('section', 'panel advanced-visualizer');
    const toolbar = create('div', 'visualizer-toolbar');
    const examples = create('select'); examples.id = 'visualizerExample'; examples.setAttribute('aria-label', 'Load example code');
    [['loop','Loop + running total'],['function','Function + return value'],['condition','If / else + loop']].forEach(function (entry) { const option = create('option','',entry[1]); option.value = entry[0]; examples.append(option); });
    const load = button('Load example','visualizer-load-example','btn btn-secondary');
    const run = button('Run & trace','visualizer-run','btn btn-primary');
    const clear = button('Clear code','visualizer-clear','btn btn-quiet');
    toolbar.append(examples,load,run,clear); workspace.append(toolbar);
    const editorLabel = create('label','visualizer-editor-label','Your JavaScript code');
    const editor = create('textarea','visualizer-input'); editor.id = 'visualizerCode'; editor.spellcheck = false; editor.autocapitalize = 'off'; editor.autocomplete = 'off'; editor.setAttribute('aria-label','Paste JavaScript code to explain and trace'); editor.value = visualizerState.code;
    editorLabel.htmlFor = 'visualizerCode'; workspace.append(editorLabel,editor);
    const status = create('p','visualizer-status',visualizerState.status); status.id = 'visualizerStatus'; status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); workspace.append(status);
    const stepControls = create('div','button-row'); stepControls.append(button('⟵ Previous','visualizer-prev','btn btn-secondary'),button('Next step ⟶','visualizer-next','btn btn-primary'),button('Jump to end','visualizer-end','btn btn-secondary'),button('Reset steps','visualizer-reset','btn btn-quiet')); workspace.append(stepControls);
    const stepMeta = create('p','muted','No trace yet. Press Run & trace to start.'); stepMeta.id = 'visualizerStepMeta'; workspace.append(stepMeta);
    const grid = create('div','visualizer-result-grid');
    const codePanel = create('section','visualizer-result-panel'); codePanel.append(create('h2','','Execution line')); const codeView = create('pre','visualizer-code'); codeView.id = 'visualizerCodeView'; codePanel.append(codeView);
    const variablePanel = create('section','visualizer-result-panel'); variablePanel.append(create('h2','','Variable memory')); const variableView = create('div','visualizer-variables'); variableView.id = 'visualizerVariables'; variablePanel.append(variableView);
    const explainPanel = create('section','visualizer-result-panel'); explainPanel.append(create('h2','','Explain it simply')); const explain = create('p','visualizer-explanation','Your line-by-line explanation will appear here.'); explain.id = 'visualizerExplanation'; explainPanel.append(explain); const outputTitle=create('h2','','Console output'); const output=create('pre','visualizer-console','No output yet.'); output.id='visualizerOutput'; explainPanel.append(outputTitle,output);
    grid.append(codePanel,variablePanel,explainPanel); workspace.append(grid);
    const walkthroughPanel=create('section','visualizer-result-panel visualizer-full-walkthrough');walkthroughPanel.append(create('h2','','Whole-code walkthrough'));const walkthrough=create('div','visualizer-walkthrough-list');walkthrough.id='visualizerFullWalkthrough';walkthroughPanel.append(walkthrough);workspace.append(walkthroughPanel);
    const help = create('details','visualizer-help'); const summary=create('summary','','How to use this visualizer'); help.append(summary); const helpList=create('ol'); ['Paste JavaScript into the editor or load an example.','Press Run & trace. The code executes in a separate worker and the app records snapshots.','Use Previous and Next to move between snapshots. The highlighted line shows where that snapshot was recorded.','Read Variable memory to see current values and Console output to see logged messages.','If tracing fails, simplify the code to one statement per line and add braces around loop/if bodies.'].forEach(function (item){helpList.append(create('li','',item));}); help.append(helpList); workspace.append(help); app.append(workspace);
    renderVisualizerStep();
  }

  function renderVisualizerStep() {
    const meta = document.getElementById('visualizerStepMeta'); const codeView=document.getElementById('visualizerCodeView'); const vars=document.getElementById('visualizerVariables'); const explanation=document.getElementById('visualizerExplanation'); const output=document.getElementById('visualizerOutput'); const walkthrough=document.getElementById('visualizerFullWalkthrough');
    if (!meta || !codeView || !vars || !explanation || !output) return;
    const lines = visualizerState.code.split('\n');
    if(walkthrough){walkthrough.replaceChildren();lines.forEach(function(line,i){const row=create('article','visualizer-walkthrough-row');const title=create('div','visualizer-walkthrough-code','Line '+(i+1)+': '+(line.trim()||'(blank line)'));const desc=create('p','',explainJsLine(line));row.append(title,desc);walkthrough.append(row);});}
    if (!visualizerState.steps.length) {
      codeView.textContent = lines.map(function(line,i){return String(i+1).padStart(3,' ')+'  '+line;}).join('\n');
      vars.replaceChildren(create('p','muted','Run code to capture variables.')); explanation.textContent='Choose a line in your code mentally, then run the tracer to see how its values change.'; output.textContent=visualizerState.logs.length?visualizerState.logs.join('\n'):'No output yet.'; meta.textContent='No trace snapshots recorded yet.'; return;
    }
    visualizerState.index = Math.max(0,Math.min(visualizerState.index,visualizerState.steps.length-1));
    const step=visualizerState.steps[visualizerState.index];
    codeView.replaceChildren(); lines.forEach(function(line,i){const span=create('span','visualizer-line'+(i+1===step.line?' active':''),String(i+1).padStart(3,' ')+'  '+line);codeView.append(span,document.createTextNode('\n'));});
    vars.replaceChildren(); const entries=Object.entries(step.variables||{});
    if(!entries.length) vars.append(create('p','muted','No variables could be read at this line yet.'));
    entries.forEach(function(entry){const row=create('div','visualizer-variable-row');row.append(create('code','',entry[0]),create('span','visualizer-variable-value',typeof entry[1]==='string'?entry[1]:JSON.stringify(entry[1])));vars.append(row);});
    const sourceLine=lines[step.line-1]||''; explanation.textContent='Line '+step.line+': '+explainJsLine(sourceLine)+(step.note?' '+step.note:'');
    output.textContent=visualizerState.logs.length?visualizerState.logs.join('\n'):'The program has not written anything to the console yet.';
    meta.textContent='Snapshot '+(visualizerState.index+1)+' of '+visualizerState.steps.length+' · source line '+step.line+(step.phase?' · '+step.phase:'');
    const prev=document.querySelector('[data-action="visualizer-prev"]'); const next=document.querySelector('[data-action="visualizer-next"]'); if(prev)prev.disabled=visualizerState.index===0;if(next)next.disabled=visualizerState.index>=visualizerState.steps.length-1;
  }

  function runVisualizer() {
    stopVisualizerWorker();
    const editor=document.getElementById('visualizerCode'); if(!editor)return;
    visualizerState.code=editor.value;saveStored('projectx-visualizer-code',visualizerState.code);visualizerState.steps=[];visualizerState.logs=[];visualizerState.index=0;visualizerState.status='Preparing isolated execution…';renderVisualizerStep();
    const status=document.getElementById('visualizerStatus');if(status)status.textContent=visualizerState.status;
    const names=new Set();
    visualizerState.code.replace(/\b(?:let|const|var)\s+([A-Za-z_$][\w$]*)/g,function(_,name){names.add(name);return _;});
    visualizerState.code.replace(/\bfunction\s*[\w$]*\s*\(([^)]*)\)/g,function(_,args){args.split(',').forEach(function(arg){const n=arg.trim().match(/^[A-Za-z_$][\w$]*/);if(n)names.add(n[0]);});return _;});
    const variableList=Array.from(names).slice(0,60);
    const lines=visualizerState.code.split('\n');
    const instrumented=lines.map(function(line,index){
      const trim=line.trim();
      if(!trim || /^(?:\/\/|\/\*|\*|\*\/)/.test(trim) || /^(?:}|\{\s*$|else\b|catch\b|finally\b|case\b|default\s*:)/.test(trim)) return line;
      const snapshot=variableList.map(function(name){return JSON.stringify(name)+':__read(()=>'+name+')';}).join(',');
      return '__trace('+ (index+1) + ', {'+snapshot+'});\n'+line;
    }).join('\n');
    const workerSource = `self.onmessage = function(event) {\n  const source = event.data.source;\n  let count = 0;\n  const safe = function(value) { try { if (typeof value === 'undefined') return 'undefined'; if (typeof value === 'function') return '[Function]'; if (typeof value === 'bigint') return String(value)+'n'; const json=JSON.stringify(value); return json===undefined?String(value):JSON.parse(json); } catch (_) { return '[Complex value]'; } };\n  const __read = function(fn) { try { return safe(fn()); } catch (_) { return '[not available yet]'; } };\n  const __trace = function(line, variables) { if (++count > 600) throw new Error('Trace stopped after 600 snapshots to prevent an excessive trace.'); self.postMessage({type:'step',step:{line:line,variables:variables,phase:'statement '+count}}); };\n  const logs=[];\n  const fmt = function(v) { if(typeof v==='string')return v; try{return JSON.stringify(v);}catch(_){return String(v);} };\n  const consoleProxy={log:function(){logs.push(Array.from(arguments).map(fmt).join(' '));self.postMessage({type:'logs',logs:logs.slice(-100)});},info:function(){this.log.apply(this,arguments);},warn:function(){this.log.apply(this,arguments);},error:function(){this.log.apply(this,arguments);},debug:function(){this.log.apply(this,arguments);}};\n  try { const console = consoleProxy; eval(source); self.postMessage({type:'done',logs:logs}); } catch(error) { self.postMessage({type:'error',message:error && error.message ? error.message : String(error),logs:logs}); }\n};`;
    try {
      const workerUrl=URL.createObjectURL(new Blob([workerSource],{type:'text/javascript'}));const worker=new Worker(workerUrl);visualizerState.worker=worker;visualizerState.workerUrl=workerUrl;
      worker.onmessage=function(event){const message=event.data||{};if(message.type==='step'){if(visualizerState.steps.length<600){visualizerState.steps.push(message.step);if(visualizerState.steps.length===1)visualizerState.index=0;renderVisualizerStep();}}else if(message.type==='logs'){visualizerState.logs=message.logs||[];renderVisualizerStep();}else if(message.type==='done'){visualizerState.logs=message.logs||[];visualizerState.status='Execution finished. Step through '+visualizerState.steps.length+' recorded snapshots.';const box=document.getElementById('visualizerStatus');if(box)box.textContent=visualizerState.status;renderVisualizerStep();stopVisualizerWorker();}else if(message.type==='error'){visualizerState.status='Execution error: '+message.message;const box=document.getElementById('visualizerStatus');if(box)box.textContent=visualizerState.status;visualizerState.logs=message.logs||[];renderVisualizerStep();stopVisualizerWorker();}};
      worker.onerror=function(event){visualizerState.status='Tracer error: '+(event.message||'The code could not be traced. Try simpler, one-statement-per-line code.');const box=document.getElementById('visualizerStatus');if(box)box.textContent=visualizerState.status;stopVisualizerWorker();};
      visualizerState.timer=window.setTimeout(function(){if(!visualizerState.worker)return;stopVisualizerWorker();visualizerState.status='Stopped after 2.5 seconds. The code may contain an infinite loop or take too long.';const box=document.getElementById('visualizerStatus');if(box)box.textContent=visualizerState.status;renderVisualizerStep();},2500);
    } catch(error) { visualizerState.status='Could not start the worker. Open Projectx from localhost or HTTPS.';if(status)status.textContent=visualizerState.status; }
    // Pass the instrumented source to the worker only after its handlers are installed.
    if(visualizerState.worker) visualizerState.worker.postMessage({source:instrumented});
  }

  const predictQuestions = [
    {q:'What does this print?\nconsole.log(2 + "3");',choices:['5','"23"','NaN'],answer:1,why:'When a string is involved in +, JavaScript concatenates: "2" + "3" becomes "23".'},
    {q:'What is the result?\nconsole.log([1, 2, 3].filter(n => n > 1));',choices:['[1]','[2, 3]','[1, 2, 3]'],answer:1,why:'filter() keeps values that satisfy the condition.'},
    {q:'What prints?\nlet x = 3;\nconsole.log(x++);',choices:['3','4','undefined'],answer:0,why:'Post-increment returns the old value first, then increases x.'},
    {q:'What is Boolean("")?',choices:['true','false','""'],answer:1,why:'An empty string is falsy.'},
    {q:'What does typeof [] return?',choices:['"array"','"object"','"undefined"'],answer:1,why:'Arrays are objects in JavaScript; Array.isArray(value) checks specifically for arrays.'}
  ];
  function renderPredict() {
    app.replaceChildren(); const heading=create('header','page-heading'); heading.append(create('span','eyebrow','Think before you run'),create('h1','','Predict the output'),create('p','lead','Choose what you think the code will do. Check your answer to see the explanation.')); app.append(heading);
    const grid=create('div','predict-grid'); predictQuestions.forEach(function(q,i){const card=create('section','panel predict-card');card.append(create('span','badge','Question '+(i+1)),create('pre','',q.q));const opts=create('div','quiz-options');q.choices.forEach(function(choice,j){const label=create('label','quiz-option');const input=create('input');input.type='radio';input.name='predict-'+i;input.value=String(j);label.append(input,create('span','',choice));opts.append(label);});card.append(opts);const feedback=create('p','quiz-feedback');feedback.id='predict-feedback-'+i;card.append(button('Check prediction','check-predict','btn btn-primary'));card.lastChild.dataset.question=String(i);card.append(feedback);grid.append(card);});app.append(grid);
  }

  const debugQuestions = [
    {title:'Bug 1: Assignment or comparison?',code:'const age = 18;\nif (age = 18) {\n  console.log("Eligible");\n}',choices:['Use === instead of = in the condition','Change const to let','Remove console.log'],answer:0,why:'A single = assigns a value. Use === to compare values.'},
    {title:'Bug 2: Array index',code:'const colors = ["red", "blue"];\nconsole.log(colors[2]);',choices:['Use colors[1] to get blue','Arrays start at 1','Use colors.length(2)'],answer:0,why:'Array indexes start at 0, so the second item is at index 1.'},
    {title:'Bug 3: Return value',code:'function double(n) {\n  n * 2;\n}\nconsole.log(double(4));',choices:['Add return before n * 2','Use console.log inside the function only','Change n to a string'],answer:0,why:'A function returns undefined unless it explicitly returns a value (or uses an expression-bodied arrow function).'}
  ];
  function renderDebugLab(){app.replaceChildren();const heading=create('header','page-heading');heading.append(create('span','eyebrow','Find the bug'),create('h1','','Debugging lab'),create('p','lead','Inspect the broken code, choose the best fix, and read why it works.'));app.append(heading);const grid=create('div','practice-grid');debugQuestions.forEach(function(q,i){const card=create('article','panel practice-card');card.append(create('h2','',q.title),create('pre','',q.code));const options=create('div','quiz-options');q.choices.forEach(function(c,j){const label=create('label','quiz-option');const input=create('input');input.type='radio';input.name='debug-'+i;input.value=String(j);label.append(input,create('span','',c));options.append(label);});card.append(options);const feedback=create('p','quiz-feedback');feedback.id='debug-feedback-'+i;card.append(button('Check fix','check-debug','btn btn-primary'));card.lastChild.dataset.question=String(i);card.append(feedback);grid.append(card);});app.append(grid);}

  const interviewQuestions = [
    ['What is the difference between let, const, and var?','let and const are block-scoped. const prevents reassignment of the binding. var is function-scoped (or global-scoped) and has different hoisting behavior. Prefer const by default, let when reassignment is needed, and avoid var in modern code.'],
    ['What is the difference between == and ===?','== may coerce types before comparison; === compares without type coercion. Prefer === unless coercion is explicitly intended.'],
    ['What do map(), filter(), and reduce() do?','map transforms each item; filter keeps items matching a condition; reduce combines items into one accumulated result.'],
    ['What is a Promise?','A Promise represents the eventual success or failure of an asynchronous operation. It can be handled with then/catch or async/await.'],
    ['What is event delegation?','Attach one event listener to a common ancestor and use event.target or closest() to handle events from child elements. It reduces listeners and works with dynamically added children.'],
    ['What is a closure?','A closure is a function together with access to variables from its surrounding lexical scope, even after the outer function has finished.'],
    ['Why is textContent safer than innerHTML for user input?','textContent treats input as text. innerHTML parses strings as markup and can introduce cross-site scripting when untrusted content is inserted unsafely.'],
    ['What is async/await?','Syntax built on Promises that lets asynchronous code be written in a sequential style. Use try/catch to handle rejected operations.']
  ];
  function renderInterview(){app.replaceChildren();const heading=create('header','page-heading');heading.append(create('span','eyebrow','Revise for interviews'),create('h1','','JavaScript interview prep'),create('p','lead','Try answering aloud before revealing the explanation.'));app.append(heading);const grid=create('div','interview-grid');interviewQuestions.forEach(function(item,i){const card=create('details','panel interview-card');card.append(create('summary','',item[0]),create('p','',item[1]));grid.append(card);});app.append(grid);}

  function renderSecurityLab(){app.replaceChildren();const heading=create('header','page-heading');heading.append(create('span','eyebrow','Security basics'),create('h1','','Web security practice lab'),create('p','lead','Learn why untrusted input should be treated as data. This local demo never executes the entered text.'));app.append(heading);const panel=create('section','panel security-panel');panel.append(create('h2','','Safe text rendering'));panel.append(create('p','','Enter text below. The safe preview uses textContent, so HTML-like input appears as text instead of being parsed as markup.'));
    const input=create('textarea');input.id='securityInput';input.rows=3;input.maxLength=500;input.value='<b>Hello learner</b>';input.setAttribute('aria-label','Sample untrusted text');panel.append(input);panel.append(button('Render safely','security-render','btn btn-primary'));
    const output=create('div','security-output');output.id='securityOutput';output.setAttribute('aria-live','polite');output.textContent='Click Render safely to preview the text.';panel.append(output);
    const notes=create('ul');['Use textContent for plain text.','Validate data on the server too when a backend exists.','Never put secrets or private API keys in frontend JavaScript.','A client-side demo is not a substitute for server-side security controls.'].forEach(function(t){notes.append(create('li','',t));});panel.append(notes);app.append(panel);}

  function renderProjects() {
    app.replaceChildren();
    const heading = create('header', 'page-heading');
    heading.append(create('span', 'eyebrow', 'Learn by making'));
    heading.append(create('h1', '', 'JavaScript projects'));
    heading.append(create('p', 'lead', 'Use these project ideas to combine the concepts you have learned. Start small, test each feature, and improve it in steps.'));
    app.append(heading);
    const grid = create('div', 'project-grid');
    data.projects.forEach(function (project) {
      const card = create('article', 'project-card');
      card.append(create('span', 'badge', project.level));
      card.append(create('h2', '', project.title));
      card.append(create('p', '', project.description));
      const lessons = create('div', 'mini-tags');
      project.lessons.forEach(function (id) {
        if (data.lessons[id]) lessons.append(routeLink(data.lessons[id].title, { lesson: id }, 'tag'));
      });
      card.append(lessons);
      grid.append(card);
    });
    app.append(grid);

    const guided = create('section', 'section guided-projects');
    guided.append(create('h2', '', 'Try guided mini-projects'));
    guided.append(create('p', 'lead', 'These small demos work directly in your browser. Change the values, interact with the controls, and inspect the code in the Tryit editor.'));
    const demos = create('div', 'guided-demo-grid');

    const calc = create('article', 'panel guided-demo');
    calc.append(create('h3', '', 'Mini calculator'));
    calc.append(create('p', '', 'Practice inputs, functions, conditions, and events.'));
    const calcForm = create('div', 'demo-controls');
    const a = create('input'); a.type = 'number'; a.id = 'demoCalcA'; a.value = '12'; a.setAttribute('aria-label', 'First number');
    const op = create('select'); op.id = 'demoCalcOp'; op.setAttribute('aria-label', 'Operation');
    [['+','Add (+)'],['-','Subtract (-)'],['*','Multiply (×)'],['/','Divide (÷)']].forEach(function (v) { const o=create('option','',v[1]);o.value=v[0];op.append(o); });
    const b = create('input'); b.type = 'number'; b.id = 'demoCalcB'; b.value = '3'; b.setAttribute('aria-label', 'Second number');
    calcForm.append(a,op,b,button('Calculate','guided-calc','btn btn-primary'));
    calc.append(calcForm); calc.append(create('p','demo-result','Result: 15')); calc.querySelector('.demo-result').id='demoCalcResult';
    demos.append(calc);

    const todo = create('article', 'panel guided-demo');
    todo.append(create('h3', '', 'To-do list'));
    todo.append(create('p', '', 'Practice DOM updates, events, and localStorage. Tasks save on this device.'));
    const todoForm = create('form','demo-controls');
    const taskInput = create('input'); taskInput.id='demoTaskInput'; taskInput.placeholder='Add a task…'; taskInput.setAttribute('aria-label','New task'); taskInput.maxLength=120; taskInput.required=true;
    const addTask = create('button','btn btn-primary','Add task'); addTask.type='submit';
    todoForm.append(taskInput,addTask); todo.append(todoForm);
    const todoList=create('ul','demo-todo-list'); todoList.id='demoTodoList'; todo.append(todoList);
    const savedTasks=readStored('projectx-guided-tasks',function(v){return Array.isArray(v)&&v.length<100&&v.every(function(t){return t&&typeof t.text==='string'&&t.text.length<=120&&typeof t.done==='boolean';});},[]);
    savedTasks.forEach(function(t){todoList.append(makeTodoItem(t));});
    demos.append(todo);

    const quiz=create('article','panel guided-demo');quiz.append(create('h3','','Mini quiz app'),create('p','','A working three-question quiz. Choose an answer to get feedback and track your score.'));
    const quizQuestion=create('p','guided-quiz-question',guidedQuizQuestions[guidedQuizIndex].question);quizQuestion.id='guidedQuizQuestion';quiz.append(quizQuestion);
    const quizChoices=create('div','demo-quiz-choices');quizChoices.id='guidedQuizChoices';guidedQuizQuestions[guidedQuizIndex].choices.forEach(function(choice,index){const answer=button(choice,'quiz-demo-answer','btn btn-secondary');answer.dataset.answer=String(index);quizChoices.append(answer);});quiz.append(quizChoices);
    const quizFeedback=create('p','demo-result','Score: '+guidedQuizScore+' / '+guidedQuizQuestions.length);quizFeedback.id='guidedQuizFeedback';quiz.append(quizFeedback);demos.append(quiz);

    const weather=create('article','panel guided-demo');weather.append(create('h3','','Weather app'),create('p','','Look up current weather using the free Open-Meteo public API. No API key is required.'));
    const weatherControls=create('div','demo-controls');const city=create('input');city.id='weatherCity';city.placeholder='Enter a city (e.g. Hyderabad)';city.maxLength=80;city.value='Hyderabad';city.setAttribute('aria-label','City for weather lookup');const weatherButton=button('Get weather','weather-lookup','btn btn-primary');weatherControls.append(city,weatherButton);weather.append(weatherControls);
    const weatherResult=create('p','demo-result','Weather results will appear here.');weatherResult.id='weatherResult';weatherResult.setAttribute('aria-live','polite');weather.append(weatherResult);demos.append(weather);

    guided.append(demos); app.append(guided);

    const advanced = create('section','section advanced-project-library');
    advanced.append(create('h2','','Complete projects with full source code'));
    advanced.append(create('p','lead','Each project below is a complete single-file app. Open the code in Tryit, run it, then read the build plan and code walkthrough to understand how the parts work together. Data is saved in this browser using localStorage.'));
    const projectGrid=create('div','advanced-project-grid');
    (window.PROJECTX_ADVANCED_PROJECTS||[]).forEach(function(project,index){
      const card=create('article','panel advanced-project-card');card.append(create('span','badge',project.level),create('h3','',project.title),create('p','',project.description));
      const features=create('ul','project-feature-list');project.features.forEach(function(feature){features.append(create('li','',feature));});card.append(features);
      const controls=create('div','button-row');const open=button('Open complete code in Tryit','open-advanced-project','btn btn-primary');open.dataset.project=String(index);const show=button('Show / hide source code','toggle-advanced-source','btn btn-secondary');show.dataset.project=String(index);controls.append(open,show);card.append(controls);
      const source=create('pre','advanced-project-source');source.id='advancedProjectSource'+index;source.hidden=true;source.textContent=project.code;card.append(source);
      const copy=button('Copy full code','copy-advanced-project','btn btn-quiet');copy.dataset.project=String(index);card.append(copy);
      const plan=create('details','project-walkthrough');plan.append(create('summary','','Build plan and beginner explanation'));const steps=create('ol');project.walkthrough.forEach(function(step){const li=create('li');li.append(create('strong','',step.title),create('p','',step.body));steps.append(li);});plan.append(steps);const concepts=create('p','project-concepts','Main concepts: '+project.concepts.join(' · '));plan.append(concepts);card.append(plan);projectGrid.append(card);
    });
    advanced.append(projectGrid);app.append(advanced);
  }

  function makeTodoItem(task) {
    const li=create('li','demo-todo-item');
    const label=create('label',''); const check=create('input'); check.type='checkbox'; check.checked=task.done; check.dataset.action='todo-toggle';
    const text=create('span','',task.text); if(task.done) text.classList.add('todo-done');
    label.append(check,text); li.append(label);
    const remove=button('Remove','todo-remove','btn btn-quiet');
    li.append(remove); li.dataset.taskText=task.text; return li;
  }

  function exampleDocument(code, title) {
    if (/^\s*<!doctype\s+html/i.test(code) || /<html[\s>]/i.test(code)) return code;
    const hasMarkup = /<\/?[A-Za-z][^>]*>/.test(code);
    const body = hasMarkup ? code : '<script>\n' + code.replace(/<\/script/gi, '<\\/script') + '\n<\/script>';
    return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>' +
      title.replace(/[<>&"]/g, '') +
      '</title>\n<style>body{font:16px/1.5 system-ui,sans-serif;padding:20px;color:#172033}button{font:inherit;padding:8px 12px}#result{padding:10px;background:#eef6ff}</style>\n</head>\n<body>\n<main><p id="result">Page output appears here.</p>\n' +
      body + '\n</main>\n</body>\n</html>';
  }

  function renderTryit() {
    app.replaceChildren();
    const heading = create('header', 'page-heading');
    heading.append(create('span', 'eyebrow', 'Experiment safely'));
    heading.append(create('h1', '', 'Tryit editor'));
    heading.append(create('p', 'lead', 'Write and run one complete HTML document, including any styles and JavaScript. The preview runs in a sandbox separate from this page.'));
    app.append(heading);
    const safety = create('div', 'callout warning');
    safety.textContent = 'Safety note: the preview runs in a sandboxed iframe without same-origin access or popups. Network requests are blocked except for the JSONPlaceholder demo API. The full HTML preview has no guaranteed CPU-time limit, so do not run infinite loops here. The Coding Practice runner uses a separate worker that can be terminated after its time limit. Module imports and some browser APIs require a local web server (for example, VS Code Live Server).';
    app.append(safety);
    const toolbar = create('div', 'tryit-toolbar');
    toolbar.append(button('▶ Run Code', 'run-code', 'btn btn-run-code'));
    toolbar.append(button('Load HTML example', 'load-tryit-example', 'btn btn-secondary'));
    toolbar.append(button('Load JavaScript example', 'load-tryit-js-example', 'btn btn-secondary'));
    toolbar.append(button('Reset code', 'reset-code', 'btn btn-secondary'));
    toolbar.append(button('Clear Console', 'clear-output', 'btn btn-secondary'));
    toolbar.append(button('Reset Result', 'reset-result', 'btn btn-secondary'));
    toolbar.append(button('Full screen code', 'toggle-fullscreen', 'btn btn-secondary'));
    const spacer = create('span', 'spacer');
    toolbar.append(spacer);
    const positionLabel = create('label', 'output-position');
    positionLabel.append(create('span', '', 'Output position'));
    const position = create('select');
    position.id = 'outputPosition';
    [['side', 'Beside code'], ['below', 'Below code']].forEach(function (option) {
      const item = create('option', '', option[1]);
      item.value = option[0];
      position.append(item);
    });
    position.value = editorState.layout;
    positionLabel.append(position);
    toolbar.append(positionLabel, create('span', 'hint', 'Drag the divider to resize panes.'));
    app.append(toolbar);

    const workspace = create('section', 'tryit-workspace');
    workspace.id = 'tryitWorkspace';
    workspace.dataset.layout = editorState.layout;
    workspace.style.setProperty('--editor-size', editorState.size + '%');
    const editorPane = create('div', 'editor-pane');
    const editorHeading = create('div', 'editor-heading');
    editorHeading.append(create('h2', '', 'Complete code'));
    editorHeading.append(create('span', 'muted', 'HTML + CSS + JavaScript'));
    editorHeading.append(button('Exit full screen', 'toggle-fullscreen', 'btn btn-quiet fullscreen-exit'));
    editorPane.append(editorHeading);
    const codeEditor = create('div', 'code-editor');
    const highlighted = create('pre');
    highlighted.id = 'editorHighlight';
    highlighted.setAttribute('aria-hidden', 'true');
    const textarea = create('textarea');
    textarea.id = 'codeInput';
    textarea.spellcheck = false;
    textarea.setAttribute('aria-label', 'Complete HTML code editor');
    textarea.setAttribute('autocapitalize', 'off');
    textarea.setAttribute('autocomplete', 'off');
    textarea.setAttribute('autocorrect', 'off');
    textarea.value = editorState.code;
    highlighted.append(syntaxMarkup(textarea.value));
    codeEditor.append(highlighted, textarea);
    editorPane.append(codeEditor);
    const help = create('p', 'editor-help', 'Tip: press Tab to indent. Ctrl+Enter (or Cmd+Enter) runs the code. Full screen: Esc exits.');
    editorPane.append(help);
    const divider = create('div', 'workspace-divider');
    divider.id = 'workspaceDivider';
    divider.tabIndex = 0;
    divider.setAttribute('role', 'separator');
    divider.setAttribute('aria-label', 'Resize code and output panes');
    divider.setAttribute('aria-orientation', editorState.layout === 'side' ? 'vertical' : 'horizontal');
    const outputPane = create('div', 'output-pane');
    const resultHeading = create('div', 'result-heading');
    resultHeading.append(create('h2', '', 'Result'), create('span', 'result-live-label', 'Preview updates when you run code'));
    outputPane.append(resultHeading);
    const frame = create('iframe', 'preview-frame');
    frame.id = 'previewFrame';
    frame.title = 'JavaScript code output';
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('referrerpolicy', 'no-referrer');
    outputPane.append(frame);
    const consolePanel = create('section', 'console-panel');
    const consoleHeader = create('div', 'console-heading');
    consoleHeader.append(create('span', '', 'JavaScript console'));
    consoleHeader.append(create('span', 'muted', 'log · info · warnings · errors'));
    const output = create('pre', 'console-output');
    output.id = 'consoleOutput';
    consolePanel.append(consoleHeader, output);
    outputPane.append(consolePanel);
    workspace.append(editorPane, divider, outputPane);
    app.append(workspace);
    const executionStatus = create('p', 'execution-status');
    executionStatus.id = 'executionStatus';
    executionStatus.setAttribute('role', 'status');
    app.append(executionStatus);
    bindEditor(workspace, textarea, highlighted, frame, output, executionStatus, position, divider);
  }

  function bindEditor(workspace, textarea, highlighted, frame, output, executionStatus, position, divider) {
    function refreshHighlight() {
      highlighted.replaceChildren(syntaxMarkup(textarea.value + (textarea.value.endsWith('\n') ? ' ' : '')));
      highlighted.scrollTop = textarea.scrollTop;
      highlighted.scrollLeft = textarea.scrollLeft;
      editorState.code = textarea.value;
      saveStored('jsnotes-editor', editorState);
    }
    textarea.addEventListener('input', refreshHighlight);
    textarea.addEventListener('scroll', refreshHighlight);
    textarea.addEventListener('keydown', function (event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.setRangeText('  ', start, end, 'end');
        refreshHighlight();
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        runEditorCode(textarea, frame, output, executionStatus);
      }
    });
    position.addEventListener('change', function () {
      editorState.layout = position.value;
      workspace.dataset.layout = position.value;
      divider.setAttribute('aria-orientation', position.value === 'side' ? 'vertical' : 'horizontal');
      saveStored('jsnotes-editor', editorState);
    });
    let dragging = false;
    function resize(event) {
      if (!dragging) return;
      const bounds = workspace.getBoundingClientRect();
      const isVertical = editorState.layout === 'side' && window.innerWidth > 980;
      const raw = isVertical ? ((event.clientX - bounds.left) / bounds.width) * 100 :
        ((event.clientY - bounds.top) / bounds.height) * 100;
      editorState.size = Math.max(20, Math.min(80, Math.round(raw)));
      workspace.style.setProperty('--editor-size', editorState.size + '%');
      saveStored('jsnotes-editor', editorState);
    }
    divider.addEventListener('pointerdown', function (event) {
      dragging = true;
      divider.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    divider.addEventListener('pointermove', resize);
    divider.addEventListener('pointerup', function () { dragging = false; });
    divider.addEventListener('pointercancel', function () { dragging = false; });
    divider.addEventListener('keydown', function (event) {
      const direction = editorState.layout === 'side' && window.innerWidth > 980 ? 'ArrowLeft' : 'ArrowUp';
      const opposite = direction === 'ArrowLeft' ? 'ArrowRight' : 'ArrowDown';
      if (event.key === direction || event.key === opposite) {
        event.preventDefault();
        editorState.size = Math.max(20, Math.min(80, editorState.size + (event.key === direction ? -5 : 5)));
        workspace.style.setProperty('--editor-size', editorState.size + '%');
        saveStored('jsnotes-editor', editorState);
      }
    });
    editorRun = 0;
  }

  function runEditorCode(textarea, frame, output, executionStatus) {
    if (textarea.value.length > 100000) {
      executionStatus.textContent = 'The editor limit is 100,000 characters. Shorten the code before running it.';
      executionStatus.className = 'execution-status error';
      return;
    }
    output.replaceChildren();
    executionStatus.textContent = 'Running code in the sandbox…';
    executionStatus.className = 'execution-status';
    editorRun += 1;
    const token = String(Date.now()) + '-' + String(Math.random()).slice(2);
    frame.dataset.runToken = token;
    const bridge = '(function(){const token=' + JSON.stringify(token) + ';const memoryStore=new Map();const storageShim={get length(){return memoryStore.size},key(index){return Array.from(memoryStore.keys())[index]??null},getItem(key){key=String(key);return memoryStore.has(key)?memoryStore.get(key):null},setItem(key,value){memoryStore.set(String(key),String(value))},removeItem(key){memoryStore.delete(String(key))},clear(){memoryStore.clear()}};try{Object.defineProperty(window,"localStorage",{value:storageShim,configurable:true})}catch(_){};const send=(type,args)=>{let text;try{text=args.map(value=>{if(typeof value==="string")return value;try{return JSON.stringify(value)}catch(_){return String(value)}}).join(" ");}catch(_){text="(unavailable output)"}parent.postMessage({source:"jsnotes-preview",token:token,type:type,text:text.slice(0,5000)},"*")};["log","info","warn","error","debug"].forEach(method=>{const original=console[method].bind(console);console[method]=(...args)=>{send(method==="error"?"error":"log",args);original(...args)}});window.addEventListener("error",event=>send("error",[event.message||"Script error"]));window.addEventListener("unhandledrejection",event=>send("error",[event.reason&&event.reason.message?event.reason.message:event.reason]));parent.postMessage({source:"jsnotes-preview",token:token,type:"ready",text:""},"*");})();';
    const csp = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\' blob:; style-src \'unsafe-inline\'; img-src data: blob:; connect-src https://jsonplaceholder.typicode.com; font-src data:; base-uri \'none\'; form-action \'none\'; object-src \'none\'">';
    const bridgeTag = '<script>' + bridge + '<\/script>';
    let documentCode = exampleDocument(textarea.value, 'JavaScript Tryit');
    const head = /<head\b[^>]*>/i;
    if (head.test(documentCode)) {
      documentCode = documentCode.replace(head, function (opening) { return opening + csp + bridgeTag; });
    } else {
      documentCode = documentCode.replace(/<html\b[^>]*>/i, function (opening) {
        return opening + '<head>' + csp + bridgeTag + '</head>';
      });
    }
    frame.srcdoc = documentCode;
    const runNumber = editorRun;
    window.setTimeout(function () {
      if (runNumber !== editorRun) return;
      if (executionStatus.textContent === 'Running code in the sandbox…') {
        executionStatus.textContent = 'Preview loaded. Console messages will appear below.';
        executionStatus.className = 'execution-status success';
      }
    }, 2500);
  }

  function render() {
    if (!data || !data.lessons || !data.groups || !app) {
      notify('JavaScript lesson data could not be loaded. Check that lessons.js is available.', true);
      return;
    }
    currentRoute = currentRoute || readRoute();
    renderSidebar(sidebarSearch.value);
    updateProgressUi();
    const navLinks = document.querySelectorAll('.top-links [data-view]');
    navLinks.forEach(function (link) {
      link.toggleAttribute('aria-current', currentRoute.view === link.dataset.view && !currentRoute.lesson);
      if (currentRoute.view === link.dataset.view && !currentRoute.lesson) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (currentRoute.lesson) renderLesson(currentRoute.lesson);
    else if (currentRoute.view === 'projects') renderProjects();
    else if (currentRoute.view === 'practice') renderPractice();
    else if (currentRoute.view === 'visualizer') renderVisualizer();
    else if (currentRoute.view === 'predict') renderPredict();
    else if (currentRoute.view === 'debug') renderDebugLab();
    else if (currentRoute.view === 'interview') renderInterview();
    else if (currentRoute.view === 'security') renderSecurityLab();
    else if (currentRoute.view === 'tryit') {
      if (!editorState) {
        editorState = editorSaved || { code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n  <style>body { font-family: Arial, sans-serif; padding: 20px; } h1 { color: #04AA6D; }</style>\n</head>\n<body>\n  <h1>My First Heading</h1>\n  <p>My first paragraph.</p>\n  <button onclick="document.getElementById('demo').textContent = 'Hello from JavaScript!'">Try it</button>\n  <p id="demo"></p>\n</body>\n</html>`, original: '', layout: 'side', size: 50 };
        if (!editorState.original) editorState.original = editorState.code;
      }
      renderTryit();
    } else renderHome();
  }

  window.addEventListener('message', function (event) {
    const frame = document.getElementById('previewFrame');
    if (!frame || event.source !== frame.contentWindow || event.origin !== 'null') return;
    const message = event.data;
    if (!message || message.source !== 'jsnotes-preview' || message.token !== frame.dataset.runToken ||
      !['ready', 'log', 'error', 'info', 'warn', 'debug'].includes(message.type) ||
      typeof message.text !== 'string') return;
    const output = document.getElementById('consoleOutput');
    const executionStatus = document.getElementById('executionStatus');
    if (!output || !executionStatus) return;
    if (message.type === 'ready') {
      executionStatus.textContent = 'Code is running in the sandbox.';
      executionStatus.className = 'execution-status success';
      return;
    }
    const line = create('span', message.type === 'error' ? 'console-error' : '', (message.type === 'error' ? 'Error: ' : '') + message.text);
    if (output.childNodes.length) output.append(document.createTextNode('\n'));
    output.append(line);
    if (message.type === 'error') {
      executionStatus.textContent = 'The preview reported an error. See the console output.';
      executionStatus.className = 'execution-status error';
    }
  });

  document.addEventListener('click', function (event) {
    const routeElement = event.target.closest('[data-route]');
    if (routeElement) {
      event.preventDefault();
      try {
        navigate(JSON.parse(routeElement.dataset.route));
      } catch (error) {
        notify('This navigation link could not be opened: ' + error.message, true);
      }
      return;
    }
    const viewElement = event.target.closest('[data-view]');
    if (viewElement) {
      event.preventDefault();
      navigate({ view: viewElement.dataset.view });
      return;
    }
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;
    const action = actionElement.dataset.action;
    if (action === 'quiz-demo-answer') {
      const q=guidedQuizQuestions[guidedQuizIndex];if(!q)return;const correct=Number(actionElement.dataset.answer)===q.answer;if(correct)guidedQuizScore++;
      const feedback=document.getElementById('guidedQuizFeedback');if(feedback)feedback.textContent=(correct?'Correct! ':'Not quite. ')+q.explanation+' Score: '+guidedQuizScore+' / '+guidedQuizQuestions.length;
      const choices=document.getElementById('guidedQuizChoices');if(choices)choices.replaceChildren();guidedQuizIndex++;
      if(guidedQuizIndex>=guidedQuizQuestions.length){const restart=button('Try quiz again','quiz-demo-restart','btn btn-primary');if(choices)choices.append(restart);if(feedback)feedback.textContent+=' Final score: '+guidedQuizScore+' / '+guidedQuizQuestions.length+'.';}
      else {const next=button('Next question →','quiz-demo-next','btn btn-primary');if(choices)choices.append(next);}
    } else if (action === 'quiz-demo-next') {
      const q=guidedQuizQuestions[guidedQuizIndex];const question=document.getElementById('guidedQuizQuestion'),choices=document.getElementById('guidedQuizChoices'),feedback=document.getElementById('guidedQuizFeedback');if(question&&q)question.textContent=q.question;if(choices&&q){choices.replaceChildren();q.choices.forEach(function(choice,index){const answer=button(choice,'quiz-demo-answer','btn btn-secondary');answer.dataset.answer=String(index);choices.append(answer);});}if(feedback)feedback.textContent='Score: '+guidedQuizScore+' / '+guidedQuizQuestions.length;
    } else if (action === 'quiz-demo-restart') {
      guidedQuizIndex=0;guidedQuizScore=0;const q=guidedQuizQuestions[0],question=document.getElementById('guidedQuizQuestion'),choices=document.getElementById('guidedQuizChoices'),feedback=document.getElementById('guidedQuizFeedback');if(question)question.textContent=q.question;if(choices){choices.replaceChildren();q.choices.forEach(function(choice,index){const answer=button(choice,'quiz-demo-answer','btn btn-secondary');answer.dataset.answer=String(index);choices.append(answer);});}if(feedback)feedback.textContent='Score: 0 / '+guidedQuizQuestions.length;
    } else if (action === 'weather-lookup') {
      const input=document.getElementById('weatherCity'),result=document.getElementById('weatherResult'),city=input&&input.value.trim();if(!city||!result){if(result)result.textContent='Enter a city name first.';return;}result.textContent='Loading weather…';
      fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(city)+'&count=1&language=en&format=json').then(function(response){if(!response.ok)throw new Error('Could not search for that city.');return response.json();}).then(function(placeData){if(!placeData.results||!placeData.results.length)throw new Error('City not found. Check the spelling and try again.');const place=placeData.results[0];return fetch('https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(place.latitude)+'&longitude='+encodeURIComponent(place.longitude)+'&current=temperature_2m,relative_humidity_2m,wind_speed_10m').then(function(response){if(!response.ok)throw new Error('Weather service is unavailable.');return response.json();}).then(function(weatherData){const current=weatherData.current;if(!current)throw new Error('Current weather data was not returned.');result.textContent=place.name+(place.country?', '+place.country:'')+': '+current.temperature_2m+' '+(weatherData.current_units.temperature_2m||'°C')+' · Humidity '+current.relative_humidity_2m+'% · Wind '+current.wind_speed_10m+' '+(weatherData.current_units.wind_speed_10m||'km/h');});}).catch(function(error){result.textContent='Unable to load weather: '+error.message+' Please check your internet connection and try again.';});
    } else if (action === 'run-practice-tests') {
      const index=Number(actionElement.dataset.problem),problem=practiceProblems[index],textarea=document.getElementById('practiceAttempt'+index),status=document.getElementById('practiceStatus'+index);
      if(!problem||!textarea||!status)return;
      const token='px-'+Date.now()+'-'+Math.random().toString(36).slice(2);
      const userCode=textarea.value;
      const workerSource = `
        'use strict';
        const logs = [];
        const output = { textContent: '' };
        const fakeDocument = { querySelector(selector) { return selector === '#output' ? output : null; }, getElementById(id) { return id === 'output' ? output : null; } };
        Object.defineProperty(self, 'document', { value: fakeDocument, configurable: false });
        self.console = { log: (...args) => logs.push(args.map(v => { if (typeof v === 'string') return v; try { return JSON.stringify(v); } catch (_) { return String(v); } }).join(' ')), info: (...args) => logs.push(args.map(String).join(' ')), warn: (...args) => logs.push(args.map(String).join(' ')), error: (...args) => logs.push(args.map(String).join(' ')), debug: (...args) => logs.push(args.map(String).join(' ')) };
        self.fetch = () => Promise.reject(new Error('Network access is disabled in the practice runner.'));
        self.importScripts = () => { throw new Error('Loading external scripts is disabled in the practice runner.'); };
        try { Promise.resolve(new Function(${JSON.stringify(userCode)})()).then(() => self.postMessage({ logs, error: '', domText: output.textContent }), error => self.postMessage({ logs, error: error && error.message ? error.message : String(error), domText: output.textContent })); }
        catch (error) { self.postMessage({ logs, error: error && error.message ? error.message : String(error), domText: output.textContent }); }
      `;
      let worker, workerUrl;
      try {
        workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
        worker = new Worker(workerUrl);
      } catch (error) {
        if (workerUrl) URL.revokeObjectURL(workerUrl);
        status.textContent = 'This browser blocked the isolated practice runner. Open Projectx from localhost or a secure website and try again.';
        status.className = 'quiz-feedback incorrect';
        return;
      }
      const testRecord={worker:worker,workerUrl:workerUrl,index:index,expected:problem.output,testType:problem.testType||'console',status:status,timer:null};
      activePracticeTests.set(token,testRecord);
      status.textContent='Running in a separate worker (maximum 2.5 seconds)…';status.className='muted practice-status';
      function finishTest(message) {
        const test=activePracticeTests.get(token);if(!test)return;
        window.clearTimeout(test.timer);test.worker.terminate();URL.revokeObjectURL(test.workerUrl);activePracticeTests.delete(token);
        if(message.error){test.status.textContent='Runtime error: '+message.error;test.status.className='quiz-feedback incorrect';return;}
        const actual=test.testType==='dom'?String(message.domText||''):(Array.isArray(message.logs)?message.logs:[]).join('\n');
        const passed=actual.trim()===String(test.expected||'').trim();
        test.status.textContent=passed?'PASS — sample output matches.':'NOT YET — output did not match. Actual output: '+(actual||'(no output)');
        test.status.className='quiz-feedback '+(passed?'correct':'incorrect');
      }
      worker.onmessage=function(event){finishTest(event.data||{error:'The worker returned no result.'});};
      worker.onerror=function(event){event.preventDefault();finishTest({error:event.message||'The practice worker failed.'});};
      testRecord.timer=window.setTimeout(function(){const test=activePracticeTests.get(token);if(!test)return;test.worker.terminate();URL.revokeObjectURL(test.workerUrl);activePracticeTests.delete(token);test.status.textContent='Stopped after 2.5 seconds. Check for an infinite loop or code that does not finish.';test.status.className='quiz-feedback incorrect';},2500);
    } else if (action === 'save-practice-attempt') {
      const index=Number(actionElement.dataset.problem),textarea=document.getElementById('practiceAttempt'+index);
      if(textarea&&practiceProblems[index]){saveStored('projectx-practice-attempt-'+index,textarea.value);saveStored('projectx-practice-attempt-status-'+index,{savedAt:new Date().toISOString(),chars:textarea.value.length});const status=document.getElementById('practiceStatus'+index);if(status)status.textContent='Attempt saved on this device. Open it in Tryit to run and test it.';notify('Practice attempt saved.');}
    } else if (action === 'practice-starter') {
      const problem=practiceProblems[Number(actionElement.dataset.problem)]; if(!problem)return;
      const code=exampleDocument(problem.starter,'Coding practice: '+problem.title);
      editorState={code:code,original:code,layout:editorSaved?editorSaved.layout:'side',size:editorSaved?editorSaved.size:50};editorSaved=editorState;saveStored('jsnotes-editor',editorState);navigate({view:'tryit'});
    } else if (action === 'practice-solution') {
      const index=Number(actionElement.dataset.problem);const code=document.getElementById('practiceSolution'+index);if(code){code.hidden=!code.hidden;actionElement.textContent=code.hidden?'Reveal solution':'Hide solution';}
    } else if (action === 'check-predict') {
      const i=Number(actionElement.dataset.question),q=predictQuestions[i],checked=document.querySelector('input[name="predict-'+i+'"]:checked'),feedback=document.getElementById('predict-feedback-'+i);
      if(!checked){feedback.textContent='Choose an answer first.';feedback.className='quiz-feedback incorrect';return;}
      const ok=Number(checked.value)===q.answer;feedback.textContent=(ok?'Correct! ':'Not quite. ')+q.why;feedback.className='quiz-feedback '+(ok?'correct':'incorrect');
    } else if (action === 'check-debug') {
      const i=Number(actionElement.dataset.question),q=debugQuestions[i],checked=document.querySelector('input[name="debug-'+i+'"]:checked'),feedback=document.getElementById('debug-feedback-'+i);
      if(!checked){feedback.textContent='Choose a fix first.';feedback.className='quiz-feedback incorrect';return;}
      const ok=Number(checked.value)===q.answer;feedback.textContent=(ok?'Correct fix! ':'Try again. ')+q.why;feedback.className='quiz-feedback '+(ok?'correct':'incorrect');
    } else if (action === 'security-render') {
      const output=document.getElementById('securityOutput'),input=document.getElementById('securityInput');if(output&&input){output.textContent=input.value;notify('Rendered safely as plain text.');}
    } else if (action === 'open-advanced-project') { const project=(window.PROJECTX_ADVANCED_PROJECTS||[])[Number(actionElement.dataset.project)];if(!project)return;editorState={code:project.code,original:project.code,layout:editorSaved?editorSaved.layout:'side',size:editorSaved?editorSaved.size:50};editorSaved=editorState;saveStored('jsnotes-editor',editorState);navigate({view:'tryit'});
    } else if (action === 'toggle-advanced-source') { const source=document.getElementById('advancedProjectSource'+Number(actionElement.dataset.project));if(source)source.hidden=!source.hidden;
    } else if (action === 'copy-advanced-project') { const project=(window.PROJECTX_ADVANCED_PROJECTS||[])[Number(actionElement.dataset.project)];if(!project)return; if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(project.code).then(function(){notify('Complete project code copied.');}).catch(function(){notify('Clipboard access was blocked. Open the source code and copy it manually.',true);});}else{notify('Clipboard is not available here. Open the source code and copy it manually.',true);}
    } else if (action === 'visualizer-run') { runVisualizer();
    } else if (action === 'visualizer-load-example') { const choice=document.getElementById('visualizerExample'); if(choice&&visualizerExamples[choice.value]){stopVisualizerWorker();visualizerState.code=visualizerExamples[choice.value];saveStored('projectx-visualizer-code',visualizerState.code);visualizerState.steps=[];visualizerState.logs=[];visualizerState.index=0;visualizerState.status='Example loaded. Press Run & trace.';renderVisualizer();}
    } else if (action === 'visualizer-clear') { stopVisualizerWorker();visualizerState.code='';saveStored('projectx-visualizer-code','');visualizerState.steps=[];visualizerState.logs=[];visualizerState.index=0;visualizerState.status='Paste JavaScript or load an example, then select Run & trace.';renderVisualizer();
    } else if (action === 'visualizer-prev') { visualizerState.index=Math.max(0,visualizerState.index-1);renderVisualizerStep();
    } else if (action === 'visualizer-next') { visualizerState.index=Math.min(visualizerState.steps.length-1,visualizerState.index+1);renderVisualizerStep();
    } else if (action === 'visualizer-end') { visualizerState.index=Math.max(0,visualizerState.steps.length-1);renderVisualizerStep();
    } else if (action === 'visualizer-reset') { visualizerState.index=0;renderVisualizerStep();
    } else if (action === 'guided-calc') {
      const a=Number(document.getElementById('demoCalcA').value),b=Number(document.getElementById('demoCalcB').value),op=document.getElementById('demoCalcOp').value;let result;
      if(op==='/'&&b===0) result='Cannot divide by zero'; else if(op==='+')result=a+b;else if(op==='-')result=a-b;else if(op==='*')result=a*b;else result=a/b;
      document.getElementById('demoCalcResult').textContent='Result: '+result;
    } else if (action === 'todo-remove' || action === 'todo-toggle') {
      const list=document.getElementById('demoTodoList');if(!list)return;
      const li=actionElement.closest('.demo-todo-item');if(action==='todo-remove')li.remove();else li.querySelector('span').classList.toggle('todo-done',actionElement.checked);
      const tasks=Array.from(list.querySelectorAll('.demo-todo-item')).map(function(item){return {text:item.dataset.taskText,done:item.querySelector('input').checked};});saveStored('projectx-guided-tasks',tasks);
    } else if (action === 'toggle-complete') {
      const id = actionElement.dataset.lesson;
      if (completed.has(id)) completed.delete(id);
      else completed.add(id);
      persistSet('jsnotes-completed', completed);
      updateProgressUi();
      renderSidebar(sidebarSearch.value);
      renderLesson(id);
    } else if (action === 'toggle-bookmark') {
      const id = actionElement.dataset.lesson;
      if (bookmarks.has(id)) bookmarks.delete(id);
      else bookmarks.add(id);
      persistSet('jsnotes-bookmarks', bookmarks);
      renderLesson(id);
    } else if (action === 'try-example') {
      const lesson = data.lessons[actionElement.dataset.lesson];
      const section = lesson.sections[Number(actionElement.dataset.section)];
      if (!section || !section[2]) {
        notify('This section does not have runnable code.', true);
        return;
      }
      const code = exampleDocument(section[2], lesson.title);
      editorState = { code: code, original: code, layout: editorSaved ? editorSaved.layout : 'side', size: editorSaved ? editorSaved.size : 50 };
      editorSaved = editorState;
      saveStored('jsnotes-editor', editorState);
      navigate({ view: 'tryit' });
    } else if (action === 'try-exercise') {
      const exercise = data.exercises[actionElement.dataset.lesson];
      const code = exampleDocument(exercise.starter, 'JavaScript exercise');
      editorState = { code: code, original: code, layout: editorSaved ? editorSaved.layout : 'side', size: editorSaved ? editorSaved.size : 50 };
      editorSaved = editorState;
      saveStored('jsnotes-editor', editorState);
      navigate({ view: 'tryit' });
    } else if (action === 'submit-quiz') {
      const checked = document.querySelector('input[name="quiz-' + actionElement.dataset.lesson + '-' + actionElement.dataset.quiz + '"]:checked');
      const feedback = document.getElementById(actionElement.dataset.feedback);
      if (!checked) {
        feedback.textContent = 'Choose an answer before checking.';
        feedback.className = 'quiz-feedback incorrect';
        return;
      }
      const correct = checked.value === actionElement.dataset.answer;
      feedback.textContent = (correct ? 'Correct! ' : 'Not quite. ') + actionElement.dataset.explanation;
      feedback.className = 'quiz-feedback ' + (correct ? 'correct' : 'incorrect');
      const lessonId=actionElement.dataset.lesson,quizIndex=actionElement.dataset.quiz;
      if(!quizAnswers[lessonId])quizAnswers[lessonId]={};
      quizAnswers[lessonId][quizIndex]=correct;
      saveStored('projectx-quiz-answers',quizAnswers);
      const answered=Object.values(quizAnswers[lessonId]);
      quizScores[lessonId]=Math.round(answered.filter(Boolean).length/answered.length*100);
      saveStored('jsnotes-quiz-scores', quizScores);
    } else if (action === 'reset-progress') {
      if (!window.confirm('Reset completed lessons, bookmarks, quiz scores, and your last lesson?')) return;
      completed.clear();
      bookmarks.clear();
      Object.keys(quizScores).forEach(function (id) { delete quizScores[id]; });
      ['jsnotes-completed', 'jsnotes-bookmarks', 'jsnotes-quiz-scores', 'projectx-quiz-answers', 'jsnotes-last-lesson'].forEach(function (key) {
        try { window.localStorage.removeItem(key); }
        catch (error) { notify('Could not reset saved progress: ' + error.message, true); }
      });
      updateProgressUi();
      render();
      notify('Learning progress has been reset.');
    } else if (action === 'load-tryit-example' || action === 'load-tryit-js-example') {
      const examples = {
        'load-tryit-example': `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <style>body { font-family: Arial; padding: 20px; } h1 { color: #04AA6D; }</style>
</head>
<body>
  <h1>Welcome to Projectx!</h1>
  <p>This is how HTML appears in the result panel.</p>
</body>
</html>`,
        'load-tryit-js-example': `<!DOCTYPE html>
<html>
<body>
  <h2>JavaScript Example</h2>
  <p id="demo">Click the button to change this text.</p>
  <button onclick="document.getElementById('demo').textContent = 'JavaScript works!'">Run JavaScript</button>
</body>
</html>`
      };
      const code = examples[action];
      editorState = { code: code, original: code, layout: editorSaved ? editorSaved.layout : 'side', size: editorSaved ? editorSaved.size : 50 };
      editorSaved = editorState; saveStored('jsnotes-editor', editorState); renderTryit();
    } else if (action === 'run-code') {
      runEditorCode(document.getElementById('codeInput'), document.getElementById('previewFrame'), document.getElementById('consoleOutput'), document.getElementById('executionStatus'));
    } else if (action === 'reset-code') {
      const textarea = document.getElementById('codeInput');
      textarea.value = editorState.original;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      notify('Code reset to its starting example.');
    } else if (action === 'reset-result') {
      const frame = document.getElementById('previewFrame');
      const status = document.getElementById('executionStatus');
      if (frame) frame.srcdoc = '<!doctype html><html><body style="font:16px system-ui;padding:20px;color:#526070"><h2>Result preview</h2><p>Click <b>Run Code</b> to display your page here.</p></body></html>';
      if (status) { status.textContent = 'Result preview reset. Your code has not been changed.'; status.className = 'execution-status'; }
    } else if (action === 'clear-output') {
      const output = document.getElementById('consoleOutput');
      const status = document.getElementById('executionStatus');
      if (output) output.replaceChildren();
      if (status) {
        status.textContent = 'Output cleared.';
        status.className = 'execution-status';
      }
    } else if (action === 'toggle-fullscreen') {
      const active = document.body.classList.toggle('code-fullscreen');
      document.querySelectorAll('[data-action="toggle-fullscreen"]').forEach(function (toggle) {
        toggle.textContent = active ? 'Exit full screen' : 'Full screen code';
        toggle.setAttribute('aria-pressed', String(active));
      });
      if (active) document.getElementById('codeInput').focus();
    }
  });

  globalSearch.addEventListener('input', function () {
    filterState.text = globalSearch.value;
    if (currentRoute.lesson || currentRoute.view !== 'home') {
      navigate({ view: 'home' }, true);
      globalSearch.focus();
    } else renderCatalogResults();
  });
  sidebarSearch.addEventListener('input', function () { renderSidebar(sidebarSearch.value); });
  app.addEventListener('submit', function(event){
    if(event.target && event.target.id==='demoTodoForm'){event.preventDefault();}
    if(event.target && event.target.classList.contains('demo-controls') && event.target.querySelector('#demoTaskInput')){
      event.preventDefault();const input=document.getElementById('demoTaskInput'),list=document.getElementById('demoTodoList');const value=input.value.trim();if(!value)return;
      const li=makeTodoItem({text:value,done:false});list.append(li);input.value='';
      const tasks=Array.from(list.querySelectorAll('.demo-todo-item')).map(function(item){return {text:item.dataset.taskText,done:item.querySelector('input').checked};});saveStored('projectx-guided-tasks',tasks);notify('Task added and saved on this device.');
    }
  });
  app.addEventListener('input', function (event) {
    if (event.target.id === 'catalogSearch') {
      filterState.text = event.target.value;
      globalSearch.value = event.target.value;
      renderCatalogResults();
    }
  });
  app.addEventListener('change', function (event) {
    if (event.target.id === 'catalogGroup') filterState.group = event.target.value;
    else if (event.target.id === 'catalogLevel') filterState.level = event.target.value;
    else if (event.target.id === 'catalogBookmarks') filterState.bookmarked = event.target.checked;
    else return;
    renderCatalogResults();
  });
  themeToggle.addEventListener('click', function () {
    setTheme(theme === 'dark' ? 'light' : 'dark', true);
  });
  sidebarToggle.addEventListener('click', function () {
    const open = document.body.classList.toggle('sidebar-open');
    sidebarToggle.setAttribute('aria-expanded', String(open));
    sidebarBackdrop.hidden = !open;
  });
  sidebarBackdrop.addEventListener('click', function () {
    document.body.classList.remove('sidebar-open');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    sidebarBackdrop.hidden = true;
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey &&
      !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      event.preventDefault();
      globalSearch.focus();
    }
    if (event.key === 'Escape' && document.body.classList.contains('code-fullscreen')) {
      document.body.classList.remove('code-fullscreen');
      document.querySelectorAll('[data-action="toggle-fullscreen"]').forEach(function (button) {
        button.textContent = 'Full screen code';
        button.setAttribute('aria-pressed', 'false');
      });
    }
    if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
      sidebarToggle.setAttribute('aria-expanded', 'false');
      sidebarBackdrop.hidden = true;
    }
  });
  window.addEventListener('popstate', function () {
    stopActivePracticeTests();
    currentRoute = readRoute();
    editorState = null;
    render();
  });

  setTheme(theme, false);
  const searchParam = new URLSearchParams(window.location.search).get('search');
  if (searchParam && !globalSearch.value) {
    globalSearch.value = searchParam;
    filterState.text = searchParam;
  }
  currentRoute = readRoute();
  render();
  if (storageWarnings.length) notify(storageWarnings.join(' '), true);
})();
