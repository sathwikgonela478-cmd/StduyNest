/* Projectx JavaScript learning content. Includes practical, runnable examples across all 54 lessons. */
(function () {
  window.LEARNING_DATA = {
  "lessons": {
    "intro": {
      "title": "JavaScript Introduction",
      "intro": "JavaScript is a programming language that gives instructions to a computer. On websites it adds behavior: responding to clicks, updating content, checking forms, and communicating with servers.",
      "sections": [
        [
          "The three parts of a webpage",
          "HTML describes the content, CSS controls its appearance, and JavaScript controls what it does. You can also use JavaScript outside a browser with runtimes such as Node.js.",
          "const learner = \"You\";\nconsole.log(`Welcome, ${learner}!`);"
        ],
        [
          "How to learn",
          "Read a small example, predict what it will do, run it, and then change one thing. The Tryit editor lets you experiment without changing the lesson."
        ],
        [
          "Build a student introduction card",
          "Combine variables, template literals, and an object to create a readable student summary.",
          "const student = { name: \"Aarav\", course: \"BCA\", year: 1 };\nconst message = `${student.name} studies ${student.course} (Year ${student.year}).`;\nconsole.log(message);",
          "Aarav studies BCA (Year 1).",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "testing": {
      "title": "Testing Basics",
      "intro": "A test checks that code produces an expected result. Small tests catch mistakes early and make later changes safer.",
      "sections": [
        [
          "Arrange, act, assert",
          "Set up the input, call the code, and compare its result with what you expect.",
          "function add(a, b) { return a + b; }\nconst actual = add(2, 3);\nconst expected = 5;\nconsole.assert(actual === expected, \"add should return 5\");"
        ],
        [
          "Test edge cases",
          "Test normal input, empty values, boundaries, and invalid data. Larger projects commonly use test runners such as Vitest, Jest, or Node’s built-in test runner."
        ],
        [
          "Test a discount function",
          "Write a few assertions for normal values and boundary conditions.",
          "function discountPrice(price, percent) {\n  if (price < 0 || percent < 0 || percent > 100) throw new RangeError(\"Invalid price or discount\");\n  return Number((price * (1 - percent / 100)).toFixed(2));\n}\nfunction assertEqual(actual, expected, label) {\n  if (actual !== expected) throw new Error(label + \": expected \" + expected + \", received \" + actual);\n  console.log(\"PASS:\", label);\n}\nassertEqual(discountPrice(100, 10), 90, \"10% discount\");\nassertEqual(discountPrice(250, 0), 250, \"zero discount\");\nassertEqual(discountPrice(80, 100), 0, \"full discount\");"
        ],
        [
          "Test a shopping discount calculator",
          "Test normal, zero-discount, and invalid boundary cases with a small assertion helper.",
          "function finalPrice(price, discount) {\n  if (price < 0 || discount < 0 || discount > 100) throw new RangeError(\"Invalid input\");\n  return Number((price * (1 - discount / 100)).toFixed(2));\n}\nfunction assertEqual(actual, expected, label) {\n  if (actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);\n  console.log(\"PASS:\", label);\n}\nassertEqual(finalPrice(1200, 10), 1080, \"10% discount\");\nassertEqual(finalPrice(500, 0), 500, \"No discount\");\nassertEqual(finalPrice(80, 100), 0, \"Full discount\");",
          "PASS: 10% discount\nPASS: No discount\nPASS: Full discount",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "performance": {
      "title": "Performance and Memory",
      "intro": "Performance means how quickly and smoothly a program works. Measure before optimizing so you focus on real bottlenecks.",
      "sections": [
        [
          "Avoid unnecessary work",
          "Choose clear algorithms, avoid repeating expensive calculations, and keep long tasks from blocking the browser interface."
        ],
        [
          "Memory and garbage collection",
          "JavaScript automatically reclaims memory that can no longer be reached. Long-lived event listeners, timers, and references can keep data alive unnecessarily."
        ],
        [
          "Measure performance",
          "Use browser performance tools to record and inspect real behavior rather than guessing."
        ],
        [
          "Compare one-pass summary with repeated sorting",
          "A single pass can find minimum and maximum without sorting the whole array. Use performance.now() for measurement, but results vary by device.",
          "const values = Array.from({ length: 10000 }, (_, index) => (index * 37) % 997);\nlet min = Infinity;\nlet max = -Infinity;\nconst start = performance.now();\nfor (const value of values) {\n  if (value < min) min = value;\n  if (value > max) max = value;\n}\nconst elapsed = performance.now() - start;\nconsole.log(\"Minimum:\", min, \"Maximum:\", max);\nconsole.log(\"One-pass time (ms):\", elapsed.toFixed(3));"
        ],
        [
          "Summarize sales in one pass",
          "Calculate total, minimum, and maximum without sorting the complete array.",
          "const sales = [1250, 800, 2190, 450, 1675];\nlet total = 0, min = Infinity, max = -Infinity;\nfor (const sale of sales) { total += sale; min = Math.min(min, sale); max = Math.max(max, sale); }\nconsole.log(\"Total sales:\", total);\nconsole.log(\"Smallest sale:\", min);\nconsole.log(\"Largest sale:\", max);",
          "Total sales: 6365\nSmallest sale: 450\nLargest sale: 2190",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "node-and-npm": {
      "title": "Node.js and npm",
      "intro": "Node.js runs JavaScript outside a browser. npm is a package manager commonly used to install and manage JavaScript libraries.",
      "sections": [
        [
          "Run JavaScript with Node",
          "Install Node.js, save code in a .js file, then run it from a terminal with node filename.js.",
          "console.log(\"Running outside the browser\");"
        ],
        [
          "Packages and package.json",
          "A project manifest records scripts and dependencies. Install packages only when a project needs them, and review the package documentation."
        ],
        [
          "Browser and server environments",
          "Node has APIs such as filesystem access that browsers do not. Browser code has APIs such as document that Node does not provide by default."
        ],
        [
          "Create a reusable utility function",
          "This dependency-free example demonstrates a small utility you can also run with Node.js.",
          "function formatReceipt(items) {\n  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n  return `Items: ${items.length} | Total: ₹${total.toFixed(2)}`;\n}\nconsole.log(formatReceipt([{ price: 199, quantity: 2 }, { price: 499, quantity: 1 }]));",
          "Items: 2 | Total: ₹897.00",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "setup": {
      "title": "Set Up JavaScript",
      "intro": "You do not need to install anything to start. A browser and a text editor are enough for the first lessons.",
      "sections": [
        [
          "Use the browser console",
          "Open developer tools with F12, choose Console, type JavaScript, and press Enter.",
          "console.log(\"My first JavaScript line\");"
        ],
        [
          "Connect a JavaScript file",
          "Put the script tag just before the closing body tag so the HTML elements exist before the script runs.",
          "<script src=\"app.js\"></script>"
        ],
        [
          "Run a file",
          "Save the HTML and JavaScript files in the same folder and open the HTML file in a browser. For module lessons, use a local web server because browsers restrict modules on file URLs."
        ],
        [
          "Run a first useful calculation",
          "Start with values, calculate a result, and print a clear message in the browser console.",
          "const hoursStudied = 2.5;\nconst days = 6;\nconst totalHours = hoursStudied * days;\nconsole.log(`Study time this week: ${totalHours} hours`);",
          "Study time this week: 15 hours",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "output": {
      "title": "JavaScript Output",
      "intro": "Output means showing or inspecting a result. The right output method depends on whether you are learning, updating a webpage, or debugging.",
      "sections": [
        [
          "Console output",
          "Use console.log while learning and debugging. It writes a value to the browser developer console.",
          "console.log(\"Hello!\");\nconsole.log(2 + 3);"
        ],
        [
          "Page output",
          "Select an HTML element and set its textContent to display plain text on the page.",
          "document.querySelector(\"#result\").textContent = \"It works!\";"
        ],
        [
          "Other output tools",
          "alert() opens a dialog, but it interrupts the page, so it is rarely a good interface. document.write() is mainly for simple demonstrations; avoid it in normal apps."
        ],
        [
          "Format a bill for display",
          "Use console output to present a calculated bill in a readable format.",
          "const items = [{ name: \"Notebook\", price: 45, qty: 3 }, { name: \"Pen\", price: 10, qty: 2 }];\nconst total = items.reduce((sum, item) => sum + item.price * item.qty, 0);\nconsole.log(\"--- RECEIPT ---\");\nitems.forEach(item => console.log(`${item.name}: ₹${item.price * item.qty}`));\nconsole.log(`Total: ₹${total}`);",
          "--- RECEIPT ---\nNotebook: ₹135\nPen: ₹20\nTotal: ₹155",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "syntax": {
      "title": "JavaScript Syntax and Statements",
      "intro": "Syntax is the set of rules used to write valid code. JavaScript is case-sensitive: name and Name are different identifiers.",
      "sections": [
        [
          "Statements and blocks",
          "A statement is an instruction. Braces group statements into a block. Semicolons are recommended for clarity, even though JavaScript can insert some automatically.",
          "const score = 8;\nif (score > 5) {\n  console.log(\"Good score\");\n}"
        ],
        [
          "Comments",
          "Comments explain code to people and are ignored by JavaScript.",
          "// One-line comment\n/* A comment\n   across multiple lines */"
        ],
        [
          "Create a clear result message",
          "Use statements, expressions, and template literals to produce a formatted result.",
          "const studentName = \"Maya\";\nconst marks = 87;\nconst totalMarks = 100;\nconst percentage = (marks / totalMarks) * 100;\nconsole.log(`${studentName} scored ${percentage}% (${marks}/${totalMarks}).`);",
          "Maya scored 87% (87/100).",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "variables": {
      "title": "JavaScript Variables",
      "intro": "A variable is a named place to keep a value so your program can use it later. Choose a name that explains what the value means.",
      "sections": [
        [
          "Create and use a variable",
          "Use const by default. Use let when you need to assign a new value later.",
          "const studentName = \"Mina\";\nlet score = 0;\nscore = score + 1;\nconsole.log(studentName, score);"
        ],
        [
          "Good names",
          "Names may contain letters, digits, underscores, and dollar signs, but cannot start with a digit. JavaScript convention uses camelCase, such as totalPrice."
        ],
        [
          "Student result card",
          "Combine a student name, subject marks, and a calculated total to create a useful result summary.",
          "const studentName = \"Aarav\";\nconst maths = 86;\nconst science = 91;\nconst english = 78;\nconst total = maths + science + english;\nconst average = total / 3;\nconsole.log(\"Student:\", studentName);\nconsole.log(\"Total:\", total, \"/ 300\");\nconsole.log(\"Average:\", average.toFixed(1) + \"%\");"
        ],
        [
          "Shopping bill with discount",
          "Calculate a cart total and apply a discount only when the order reaches the minimum amount.",
          "const itemPrice = 749;\nconst quantity = 2;\nconst subtotal = itemPrice * quantity;\nconst discount = subtotal >= 1000 ? subtotal * 0.10 : 0;\nconst finalTotal = subtotal - discount;\nconsole.log(\"Subtotal: ₹\" + subtotal.toFixed(2));\nconsole.log(\"Discount: ₹\" + discount.toFixed(2));\nconsole.log(\"Pay: ₹\" + finalTotal.toFixed(2));"
        ],
        [
          "Calculate a monthly budget",
          "Store expenses in variables and calculate how much money remains.",
          "const monthlyBudget = 6000;\nconst rent = 2500;\nconst food = 1800;\nconst travel = 650;\nconst remaining = monthlyBudget - rent - food - travel;\nconsole.log(\"Spent:\", rent + food + travel);\nconsole.log(\"Remaining:\", remaining);",
          "Spent: 4950\nRemaining: 1050",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "let-const": {
      "title": "let, const, and var",
      "intro": "These keywords declare variables, but they differ in whether reassignment is allowed and where the name is visible.",
      "sections": [
        [
          "const and let",
          "const prevents reassignment of the variable name. It does not freeze an object or array stored in that variable. let allows reassignment. Both are block-scoped.",
          "const colors = [\"blue\"];\ncolors.push(\"green\"); // Allowed\nlet count = 1;\ncount = 2; // Allowed"
        ],
        [
          "Why avoid var?",
          "var is function-scoped and can be redeclared in surprising ways. Prefer let and const in modern code."
        ],
        [
          "Track a game score",
          "Use let for a value that changes and const for fixed game settings.",
          "const winningScore = 100;\nlet score = 0;\nscore += 25;\nscore += 40;\nscore += 38;\nconsole.log(\"Final score:\", score);\nconsole.log(\"Winner:\", score >= winningScore);"
        ],
        [
          "Track stock changes safely",
          "Use const for a fixed product name and let for a quantity that changes.",
          "const product = \"USB drive\";\nlet stock = 12;\nstock -= 3;\nstock += 5;\nconsole.log(`${product} stock: ${stock}`);",
          "USB drive stock: 14",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "modern-syntax": {
      "title": "Modern JavaScript Syntax",
      "intro": "Modern JavaScript (often called ES6+) adds language features that make common code shorter and easier to read.",
      "sections": [
        [
          "Template literals",
          "Backticks allow multiline strings and interpolation with ${expression}.",
          "const name = \"Jo\";\nconsole.log(`Hello, ${name}!`);"
        ],
        [
          "Optional chaining and nullish coalescing",
          "?. safely reads a property when an earlier value may be null or undefined. ?? supplies a fallback only for null or undefined.",
          "const user = null;\nconst city = user?.address?.city ?? \"Unknown\";\nconsole.log(city);"
        ],
        [
          "Destructuring and spread",
          "Use destructuring to take values from arrays or objects. Spread copies values into a new array or object; see the dedicated lesson for more examples."
        ],
        [
          "Summarize orders with modern syntax",
          "Use template literals, arrow functions, optional chaining, and nullish coalescing in one practical example.",
          "const order = {\n  customer: { name: \"Diya\" },\n  deliveryNote: \"\",\n  total: 1499\n};\nconst customerName = order.customer?.name ?? \"Guest\";\nconst note = order.deliveryNote || \"No delivery note\";\nconst formatRupees = amount => new Intl.NumberFormat(\"en-IN\", { style: \"currency\", currency: \"INR\" }).format(amount);\nconsole.log(customerName + \": \" + formatRupees(order.total));\nconsole.log(note);"
        ],
        [
          "Use template literals and defaults",
          "Combine default parameters, arrow functions, and template literals in a practical summary.",
          "const greet = (name = \"Learner\", topic = \"JavaScript\") => `Hello ${name}, today you are learning ${topic}.`;\nconsole.log(greet(\"Riya\", \"arrays\"));\nconsole.log(greet());",
          "Hello Riya, today you are learning arrays.\nHello Learner, today you are learning JavaScript.",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "data-types": {
      "title": "JavaScript Data Types",
      "intro": "A data type describes what kind of value you have. JavaScript has primitive values and objects.",
      "sections": [
        [
          "Primitive types",
          "The primitive types are string, number, bigint, boolean, undefined, symbol, and null. A string is text; a boolean is true or false.",
          "const name = \"Sam\";\nconst age = 12;\nconst isLearning = true;\nlet futureValue; // undefined\nconst nothing = null;"
        ],
        [
          "Objects",
          "Objects group related values. Arrays, functions, and dates are also objects in JavaScript.",
          "const book = { title: \"JS\", pages: 180 };\nconst topics = [\"values\", \"functions\"];"
        ],
        [
          "Check a type",
          "typeof is useful, but note that typeof null returns \"object\" for historical reasons.",
          "console.log(typeof \"hello\"); // string\nconsole.log(typeof 42); // number\nconsole.log(typeof null); // object"
        ],
        [
          "Inspect a product record",
          "Use typeof to inspect primitive values and identify an object value.",
          "const productName = \"Wireless Mouse\";\nconst price = 899;\nconst inStock = true;\nconst discount = null;\nconsole.log(typeof productName); // string\nconsole.log(typeof price);      // number\nconsole.log(typeof inStock);    // boolean\nconsole.log(discount === null); // true"
        ],
        [
          "Inspect a student record",
          "Use strings, numbers, booleans, arrays, and objects in one realistic record.",
          "const student = { name: \"Dev\", marks: [78, 91, 84], active: true };\nconst total = student.marks.reduce((sum, mark) => sum + mark, 0);\nconsole.log(\"Name:\", student.name);\nconsole.log(\"Average:\", total / student.marks.length);\nconsole.log(\"Active:\", student.active);",
          "Name: Dev\nAverage: 84.33333333333333\nActive: true",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "type-conversion": {
      "title": "Type Conversion",
      "intro": "Type conversion changes a value from one type to another. Prefer explicit conversion so your intention is clear.",
      "sections": [
        [
          "Convert explicitly",
          "Number(), String(), and Boolean() convert common values. Number(\"hello\") becomes NaN because the text is not a valid number.",
          "const input = \"24\";\nconst age = Number(input);\nconsole.log(age + 1); // 25\nconsole.log(String(10)); // \"10\""
        ],
        [
          "Truthy and falsy values",
          "Falsy values include false, 0, -0, 0n, an empty string, null, undefined, and NaN. Most other values are truthy, including empty arrays and empty objects.",
          "console.log(Boolean(\"\")); // false\nconsole.log(Boolean(\"0\")); // true\nconsole.log(Boolean([])); // true"
        ],
        [
          "Convert form-like input to numbers",
          "Values from text inputs are strings; convert them before doing arithmetic.",
          "const priceInput = \"249.50\";\nconst quantityInput = \"3\";\nconst price = Number(priceInput);\nconst quantity = Number(quantityInput);\nif (Number.isFinite(price) && Number.isInteger(quantity) && quantity > 0) {\n  console.log(\"Total:\", (price * quantity).toFixed(2));\n} else { console.log(\"Please enter valid numbers.\"); }",
          "Total: 748.50",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "operators": {
      "title": "JavaScript Operators",
      "intro": "Operators perform calculations, compare values, assign values, and combine conditions.",
      "sections": [
        [
          "Arithmetic and assignment",
          "The remainder operator % gives the remainder. Exponentiation uses **. Compound assignment updates a variable using its current value.",
          "let total = 10;\ntotal += 5;\nconsole.log(total); // 15\nconsole.log(10 % 3); // 1\nconsole.log(2 ** 3); // 8"
        ],
        [
          "Compare values",
          "Use === and !== for strict comparisons so JavaScript does not silently convert types first.",
          "console.log(5 === \"5\"); // false\nconsole.log(5 !== 4); // true\nconsole.log(3 <= 4); // true"
        ],
        [
          "Logical and nullish operators",
          "&& means AND, || means OR, and ! reverses a boolean. ?? uses a fallback only for null or undefined.",
          "const displayName = \"\" || \"Guest\"; // Guest\nconst savedCount = 0 ?? 10; // 0"
        ],
        [
          "Calculate an electricity bill",
          "Apply different rates to units in each slab. This example uses illustrative rates, not an official tariff.",
          "const units = 185;\nlet bill = 0;\nif (units <= 100) {\n  bill = units * 1.5;\n} else if (units <= 200) {\n  bill = 100 * 1.5 + (units - 100) * 2.5;\n} else {\n  bill = 100 * 1.5 + 100 * 2.5 + (units - 200) * 4;\n}\nconsole.log(\"Units:\", units);\nconsole.log(\"Estimated bill: ₹\" + bill.toFixed(2));"
        ],
        [
          "Calculate a cart total",
          "Use arithmetic and comparison operators to calculate a final price and check whether delivery is free.",
          "const prices = [299, 499, 199];\nconst subtotal = prices.reduce((sum, price) => sum + price, 0);\nconst deliveryFee = subtotal >= 800 ? 0 : 49;\nconst total = subtotal + deliveryFee;\nconsole.log(\"Subtotal: ₹\" + subtotal);\nconsole.log(\"Delivery: ₹\" + deliveryFee);\nconsole.log(\"Total: ₹\" + total);"
        ],
        [
          "Calculate a cart total and discount",
          "Use arithmetic, comparison, and logical operators to calculate a discount.",
          "const subtotal = 2450;\nconst isMember = true;\nconst discountRate = subtotal >= 2000 && isMember ? 0.15 : subtotal >= 2000 ? 0.10 : 0;\nconst discount = subtotal * discountRate;\nconsole.log(\"Discount:\", discount);\nconsole.log(\"Pay:\", subtotal - discount);",
          "Discount: 367.5\nPay: 2082.5",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "conditions": {
      "title": "if, else, and Conditional Logic",
      "intro": "Conditions let a program choose which instructions to run. The condition inside parentheses is converted to true or false.",
      "sections": [
        [
          "if and else",
          "Use else if for additional cases. Braces make each branch easy to understand.",
          "const temperature = 22;\nif (temperature > 30) {\n  console.log(\"Hot\");\n} else if (temperature < 10) {\n  console.log(\"Cold\");\n} else {\n  console.log(\"Comfortable\");\n}"
        ],
        [
          "Ternary operator",
          "For a short choice that produces a value, use condition ? valueIfTrue : valueIfFalse. Do not nest many ternaries.",
          "const age = 20;\nconst access = age >= 18 ? \"Allowed\" : \"Not yet\";"
        ],
        [
          "Grade calculator",
          "Convert a score out of 100 into a grade using ordered conditions.",
          "const score = 84;\nlet grade;\nif (score < 0 || score > 100) {\n  grade = \"Invalid score\";\n} else if (score >= 90) {\n  grade = \"A\";\n} else if (score >= 80) {\n  grade = \"B\";\n} else if (score >= 70) {\n  grade = \"C\";\n} else if (score >= 50) {\n  grade = \"D\";\n} else {\n  grade = \"Needs improvement\";\n}\nconsole.log(\"Score:\", score, \"Grade:\", grade);"
        ],
        [
          "Shipping fee calculator",
          "Use conditions to calculate shipping based on order value and delivery speed.",
          "function shippingFee(orderTotal, express) {\n  if (orderTotal < 0) return \"Invalid order total\";\n  if (orderTotal >= 1500 && !express) return 0;\n  return express ? 149 : 59;\n}\nconsole.log(\"Standard: ₹\" + shippingFee(900, false));\nconsole.log(\"Express: ₹\" + shippingFee(900, true));\nconsole.log(\"Large order: ₹\" + shippingFee(1800, false));"
        ],
        [
          "Calculate a student grade",
          "Use if/else conditions to assign a grade and reject invalid marks.",
          "function getGrade(mark) {\n  if (!Number.isFinite(mark) || mark < 0 || mark > 100) return \"Invalid marks\";\n  if (mark >= 90) return \"A\";\n  if (mark >= 75) return \"B\";\n  if (mark >= 60) return \"C\";\n  if (mark >= 40) return \"D\";\n  return \"Needs improvement\";\n}\n[96, 82, 68, 45, 31, 120].forEach(mark => console.log(mark, \"=>\", getGrade(mark)));",
          "96 => A\n82 => B\n68 => C\n45 => D\n31 => Needs improvement\n120 => Invalid marks",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "switch": {
      "title": "JavaScript switch",
      "intro": "A switch compares one expression against several case values. Use break to stop a case from continuing into the next case.",
      "sections": [
        [
          "Choose a matching case",
          "The default branch runs when no case matches. Cases use strict comparison.",
          "const day = \"Monday\";\nswitch (day) {\n  case \"Monday\":\n    console.log(\"Start of week\");\n    break;\n  case \"Friday\":\n    console.log(\"Almost weekend\");\n    break;\n  default:\n    console.log(\"Another day\");\n}"
        ],
        [
          "When to use it",
          "Use switch when one value is tested against a clear list of alternatives. Use if/else for ranges or more complex conditions."
        ],
        [
          "Convert a menu choice into an action",
          "A switch statement is useful when one value can match several known options.",
          "const choice = \"3\";\nlet action;\nswitch (choice) {\n  case \"1\": action = \"View profile\"; break;\n  case \"2\": action = \"Edit profile\"; break;\n  case \"3\": action = \"View order history\"; break;\n  case \"4\": action = \"Sign out\"; break;\n  default: action = \"Unknown menu option\";\n}\nconsole.log(action);"
        ],
        [
          "Build a menu price lookup",
          "Use switch when selecting one result from a fixed set of options.",
          "function getPlanPrice(plan) {\n  switch (plan.toLowerCase()) {\n    case \"basic\": return 199;\n    case \"standard\": return 399;\n    case \"premium\": return 699;\n    default: return null;\n  }\n}\nconsole.log(\"Standard plan: ₹\" + getPlanPrice(\"standard\"));\nconsole.log(\"Unknown plan:\", getPlanPrice(\"gold\"));",
          "Standard plan: ₹399\nUnknown plan: null",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "loops": {
      "title": "JavaScript Loops",
      "intro": "Loops repeat a block of code. Always make sure the loop can eventually stop.",
      "sections": [
        [
          "for loop",
          "A for loop is useful when you know how many times to repeat. It has an initializer, condition, and update step.",
          "for (let step = 1; step <= 3; step++) {\n  console.log(`Step ${step}`);\n}"
        ],
        [
          "while and do...while",
          "while checks before each repeat. do...while checks afterward, so its body runs at least once.",
          "let count = 0;\nwhile (count < 3) {\n  console.log(count);\n  count++;\n}"
        ],
        [
          "break, continue, and iteration",
          "break exits a loop; continue skips to the next repeat. for...of reads values from an iterable such as an array. for...in visits enumerable object keys.",
          "for (const fruit of [\"pear\", \"plum\"]) {\n  console.log(fruit);\n}"
        ],
        [
          "Multiplication table generator",
          "Use a loop to generate a complete multiplication table instead of writing each line manually.",
          "const number = 7;\nfor (let multiplier = 1; multiplier <= 10; multiplier++) {\n  console.log(number + \" × \" + multiplier + \" = \" + (number * multiplier));\n}"
        ],
        [
          "Find prime numbers",
          "Check each candidate by testing divisors only up to its square root.",
          "function isPrime(number) {\n  if (number < 2) return false;\n  for (let divisor = 2; divisor <= Math.sqrt(number); divisor++) {\n    if (number % divisor === 0) return false;\n  }\n  return true;\n}\nconst primes = [];\nfor (let value = 2; value <= 50; value++) {\n  if (isPrime(value)) primes.push(value);\n}\nconsole.log(primes.join(\", \"));"
        ],
        [
          "Student marks summary",
          "Use a loop to calculate total, average, highest, and lowest marks.",
          "const marks = [78, 92, 65, 88, 74];\nlet total = 0;\nlet highest = marks[0];\nlet lowest = marks[0];\nfor (const mark of marks) {\n  total += mark;\n  if (mark > highest) highest = mark;\n  if (mark < lowest) lowest = mark;\n}\nconsole.log(\"Total:\", total);\nconsole.log(\"Average:\", (total / marks.length).toFixed(1));\nconsole.log(\"Highest:\", highest, \"Lowest:\", lowest);"
        ],
        [
          "Print a multiplication table",
          "Use a loop to generate a complete table instead of writing every line manually.",
          "const number = 7;\nfor (let i = 1; i <= 10; i++) {\n  console.log(`${number} × ${i} = ${number * i}`);\n}",
          "7 × 1 = 7\n7 × 2 = 14\n7 × 3 = 21\n7 × 4 = 28\n7 × 5 = 35\n7 × 6 = 42\n7 × 7 = 49\n7 × 8 = 56\n7 × 9 = 63\n7 × 10 = 70",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "functions": {
      "title": "JavaScript Functions",
      "intro": "A function is a reusable block of code. It can receive input through parameters and send a result back with return.",
      "sections": [
        [
          "Declare and call a function",
          "Calling a function runs its body. Arguments are the actual values passed to its parameters.",
          "function add(a, b) {\n  return a + b;\n}\nconst result = add(2, 3);\nconsole.log(result); // 5"
        ],
        [
          "Function expressions and arrows",
          "Functions can be stored in variables. Arrow functions are concise and do not create their own this value.",
          "const double = function (number) {\n  return number * 2;\n};\nconst triple = number => number * 3;"
        ],
        [
          "Default and rest parameters",
          "A default is used when an argument is missing or undefined. A rest parameter gathers remaining arguments into an array.",
          "function greet(name = \"friend\") {\n  return `Hello, ${name}`;\n}\nfunction sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}"
        ],
        [
          "Reusable discount calculator",
          "Put pricing logic in a function so it can be reused for different orders.",
          "function calculateFinalPrice(price, discountPercent = 0, taxPercent = 0) {\n  if (price < 0 || discountPercent < 0 || discountPercent > 100 || taxPercent < 0) {\n    throw new Error(\"Enter valid price, discount, and tax values.\");\n  }\n  const discounted = price * (1 - discountPercent / 100);\n  return discounted * (1 + taxPercent / 100);\n}\nconsole.log(\"Final price: ₹\" + calculateFinalPrice(1200, 15, 5).toFixed(2));\nconsole.log(\"No discount: ₹\" + calculateFinalPrice(500).toFixed(2));"
        ],
        [
          "Validate a simple input",
          "Return a clear result from a function instead of repeating validation logic.",
          "function validateUsername(username) {\n  const cleaned = username.trim();\n  if (cleaned.length < 3) return \"Use at least 3 characters.\";\n  if (!/^[a-zA-Z0-9_]+$/.test(cleaned)) return \"Use letters, numbers, or underscores only.\";\n  return \"Username looks valid.\";\n}\nconsole.log(validateUsername(\"sathwik_18\"));\nconsole.log(validateUsername(\"ab\"));\nconsole.log(validateUsername(\"bad name\"));"
        ],
        [
          "Build a reusable bill calculator",
          "Use parameters and return values so the same function works with different orders.",
          "function calculateBill(items, taxRate = 0.05) {\n  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n  const tax = subtotal * taxRate;\n  return { subtotal, tax, total: subtotal + tax };\n}\nconst bill = calculateBill([{ price: 80, quantity: 2 }, { price: 150, quantity: 1 }]);\nconsole.log(bill);",
          "{\"subtotal\":310,\"tax\":15.5,\"total\":325.5}",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "scope": {
      "title": "JavaScript Scope",
      "intro": "Scope is the set of places in a program where a name can be used. Understanding scope helps prevent accidental variable sharing.",
      "sections": [
        [
          "Block and function scope",
          "let and const are block-scoped. A variable created inside a function cannot be read outside that function.",
          "const outside = \"visible\";\nif (true) {\n  const inside = \"block only\";\n  console.log(outside, inside);\n}"
        ],
        [
          "Lexical scope",
          "An inner function can read names from the place where it was written, including outer function scopes. This is lexical scope.",
          "function makeMessage() {\n  const message = \"Hello\";\n  return function show() {\n    console.log(message);\n  };\n}"
        ],
        [
          "Compare local and outer scope",
          "A function can read an outer constant, but its local variables stay inside the function.",
          "const taxRate = 0.05;\nfunction totalWithTax(price) {\n  const tax = price * taxRate;\n  const total = price + tax;\n  return total;\n}\nconsole.log(totalWithTax(200));\nconsole.log(\"Tax rate:\", taxRate);",
          "210\nTax rate: 0.05",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "this": {
      "title": "The this Keyword",
      "intro": "The value of this is determined by how a function is called. In a method call, it usually refers to the object before the dot.",
      "sections": [
        [
          "this in a method",
          "Calling user.sayName() sets this to user for that call. Extracting the method into a variable can change the call context.",
          "const user = {\n  name: \"Ari\",\n  sayName() { return this.name; }\n};\nconsole.log(user.sayName());"
        ],
        [
          "Arrow functions and this",
          "Arrow functions do not create their own this; they capture it from the surrounding scope. This is useful in callbacks but not as an object method that needs its own receiver.",
          "const team = {\n  name: \"Blue\",\n  showLater() {\n    setTimeout(() => console.log(this.name), 0);\n  }\n};"
        ],
        [
          "bind, call, and apply",
          "These Function methods let you choose this for a regular function. bind returns a new function; call and apply invoke immediately."
        ],
        [
          "Use this in an object method",
          "When called as an object method, this refers to the object before the dot.",
          "const account = {\n  owner: \"Anika\",\n  balance: 1500,\n  deposit(amount) { this.balance += amount; return this.balance; }\n};\nconsole.log(account.deposit(500));\nconsole.log(`${account.owner} balance: ₹${account.balance}`);",
          "2000\nAnika balance: ₹2000",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "closures": {
      "title": "Hoisting and Closures",
      "intro": "Hoisting describes how declarations are processed before code runs. A closure is a function together with the variables it can still access from its outer scope.",
      "sections": [
        [
          "Hoisting",
          "Function declarations can be called before their written position. let and const exist in a temporal dead zone until their declaration runs; declare variables before using them.",
          "sayHi();\nfunction sayHi() {\n  console.log(\"Hi!\");\n}"
        ],
        [
          "Closure keeps outer state",
          "A returned inner function can keep using an outer variable after the outer function has finished. This is useful for private state and function factories.",
          "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nconsole.log(next(), next()); // 1 2"
        ],
        [
          "Create a private counter with a closure",
          "The inner function remembers the count variable even after makeCounter returns.",
          "function makeCounter(start = 0) {\n  let count = start;\n  return function () { count += 1; return count; };\n}\nconst nextTicket = makeCounter(100);\nconsole.log(nextTicket());\nconsole.log(nextTicket());\nconsole.log(nextTicket());",
          "101\n102\n103",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "recursion": {
      "title": "Recursive Functions",
      "intro": "Recursion happens when a function calls itself to solve a smaller version of the same problem. Every recursive function needs a stopping condition.",
      "sections": [
        [
          "A base case and a recursive case",
          "The base case stops the calls. The recursive case moves toward that base case. Without a base case, calls continue until the program runs out of stack space.",
          "function countdown(number) {\n  if (number <= 0) return;\n  console.log(number);\n  countdown(number - 1);\n}\ncountdown(3);"
        ],
        [
          "When recursion is useful",
          "Recursion is often useful for trees and nested structures. For simple repetition, a loop may be easier to understand."
        ],
        [
          "Calculate factorial recursively",
          "A recursive function needs a base case to stop calling itself.",
          "function factorial(n) {\n  if (!Number.isInteger(n) || n < 0) throw new RangeError(\"Use a non-negative integer\");\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(\"5! =\", factorial(5));\nconsole.log(\"0! =\", factorial(0));",
          "5! = 120\n0! = 1",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "strings": {
      "title": "JavaScript Strings",
      "intro": "A string is text. Strings are immutable: methods return new strings rather than changing the original.",
      "sections": [
        [
          "Create strings",
          "Use single quotes, double quotes, or backticks. Template literals can insert expressions using ${...}.",
          "const first = \"Ada\";\nconst greeting = `Hello, ${first}!`;\nconsole.log(greeting);"
        ],
        [
          "Useful string methods",
          "Common methods include includes, startsWith, slice, trim, replace, and toLowerCase. Method names are case-sensitive.",
          "const message = \"  Learn JavaScript  \";\nconsole.log(message.trim());\nconsole.log(message.includes(\"Java\"));\nconsole.log(\"hello\".toUpperCase());"
        ],
        [
          "Count words and characters",
          "Normalize whitespace before counting words so multiple spaces do not create empty words.",
          "const text = \"  JavaScript makes websites interactive. Learn by building projects!  \";\nconst cleaned = text.trim();\nconst words = cleaned ? cleaned.split(/\\s+/) : [];\nconsole.log(\"Characters:\", cleaned.length);\nconsole.log(\"Words:\", words.length);\nconsole.log(\"Uppercase:\", cleaned.toUpperCase());"
        ],
        [
          "Check a palindrome",
          "Normalize case and remove non-letter or non-number characters before comparing both directions.",
          "function isPalindrome(value) {\n  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, \"\");\n  return normalized === [...normalized].reverse().join(\"\");\n}\nconsole.log(isPalindrome(\"Never odd or even\")); // true\nconsole.log(isPalindrome(\"JavaScript\"));       // false"
        ],
        [
          "Create a username normalizer",
          "Trim extra spaces and normalize text before using it as a username.",
          "function normalizeUsername(value) {\n  return value.trim().toLowerCase().replace(/\\s+/g, \".\");\n}\nconsole.log(normalizeUsername(\"  Sathwik Gonela  \"));\nconsole.log(\"JavaScript\".slice(0, 4));",
          "sathwik.gonela\nJava",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "numbers": {
      "title": "Numbers and Math",
      "intro": "JavaScript uses the number type for ordinary integers and decimals. Floating-point arithmetic can have small precision differences.",
      "sections": [
        [
          "Number values",
          "NaN means “not a number” and Infinity represents a value beyond the finite range. Use Number.isNaN to check for NaN.",
          "console.log(0.1 + 0.2); // close to 0.3\nconsole.log(Number.isNaN(Number(\"abc\"))); // true\nconsole.log(Number.isInteger(4)); // true"
        ],
        [
          "Math utilities",
          "The Math object provides common operations. Math.random() returns a value from 0 inclusive to 1 exclusive.",
          "console.log(Math.round(4.6)); // 5\nconsole.log(Math.max(2, 9, 4)); // 9\nconst dice = Math.floor(Math.random() * 6) + 1;"
        ],
        [
          "Calculate a monthly budget",
          "Add expenses and calculate the amount left. Use integer paise for money to avoid common floating-point rounding surprises.",
          "const monthlyBudgetPaise = 200000; // ₹2,000.00\nconst expensesPaise = [35000, 49900, 12500, 28000];\nconst spentPaise = expensesPaise.reduce((sum, amount) => sum + amount, 0);\nconst remainingPaise = monthlyBudgetPaise - spentPaise;\nconsole.log(\"Spent: ₹\" + (spentPaise / 100).toFixed(2));\nconsole.log(\"Remaining: ₹\" + (remainingPaise / 100).toFixed(2));"
        ],
        [
          "Calculate a delivery fee",
          "Use Math.ceil and numeric checks to calculate a simple delivery fee.",
          "function deliveryFee(distanceKm) {\n  if (!Number.isFinite(distanceKm) || distanceKm < 0) return \"Invalid distance\";\n  if (distanceKm <= 2) return 25;\n  return 25 + Math.ceil(distanceKm - 2) * 8;\n}\nconsole.log(\"1.5 km:\", deliveryFee(1.5));\nconsole.log(\"5.2 km:\", deliveryFee(5.2));",
          "1.5 km: 25\n5.2 km: 57",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "internationalization": {
      "title": "Internationalization with Intl",
      "intro": "The Intl APIs format dates, numbers, and lists according to language and regional conventions.",
      "sections": [
        [
          "Format numbers",
          "Choose a locale and options rather than manually inserting commas or currency symbols.",
          "const price = new Intl.NumberFormat(\"en-US\", {\n  style: \"currency\",\n  currency: \"USD\"\n}).format(1234.5);\nconsole.log(price);"
        ],
        [
          "Format dates",
          "Intl.DateTimeFormat can display dates in a way that fits the user’s locale."
        ],
        [
          "Format prices for different locales",
          "Intl.NumberFormat formats values using locale-specific currency conventions.",
          "const amount = 123456.78;\nconsole.log(new Intl.NumberFormat(\"en-IN\", { style: \"currency\", currency: \"INR\" }).format(amount));\nconsole.log(new Intl.NumberFormat(\"en-US\", { style: \"currency\", currency: \"USD\" }).format(amount));",
          "₹1,23,456.78\n$123,456.78",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "arrays": {
      "title": "JavaScript Arrays",
      "intro": "An array stores an ordered list. Positions are called indexes and start at zero.",
      "sections": [
        [
          "Create, read, and update",
          "Use length to find the item count. Arrays can contain different types, but consistent item types are easier to work with.",
          "const fruits = [\"pear\", \"plum\"];\nconsole.log(fruits[0]); // pear\nfruits[1] = \"peach\";\nfruits.push(\"kiwi\");"
        ],
        [
          "Add and remove items",
          "push/pop operate at the end; unshift/shift operate at the beginning. splice changes an array in place.",
          "const queue = [\"A\", \"B\"];\nqueue.push(\"C\");\nconst first = queue.shift();\nconsole.log(first, queue);"
        ],
        [
          "Copying arrays",
          "Assignment copies an object reference, not the array contents. Spread makes a shallow copy.",
          "const original = [1, 2];\nconst copy = [...original];\ncopy.push(3);\nconsole.log(original, copy);"
        ],
        [
          "Inventory stock report",
          "Loop through product objects to report low-stock items and calculate the value of the inventory.",
          "const inventory = [\n  { name: \"Notebook\", price: 45, stock: 12 },\n  { name: \"Pen pack\", price: 60, stock: 4 },\n  { name: \"Backpack\", price: 850, stock: 2 }\n];\nconst lowStock = inventory.filter(item => item.stock < 5);\nconst stockValue = inventory.reduce((sum, item) => sum + item.price * item.stock, 0);\nconsole.log(\"Low stock:\", lowStock.map(item => item.name));\nconsole.log(\"Inventory value: ₹\" + stockValue);"
        ],
        [
          "Find a student by name",
          "Use find() to locate one matching record and handle the case where no student exists.",
          "const students = [\n  { name: \"Aarav\", marks: 82 },\n  { name: \"Diya\", marks: 94 },\n  { name: \"Kabir\", marks: 76 }\n];\nconst searchName = \"Diya\";\nconst student = students.find(item => item.name.toLowerCase() === searchName.toLowerCase());\nif (student) console.log(student.name + \" scored \" + student.marks);\nelse console.log(\"Student not found\");"
        ],
        [
          "Manage a list of student marks",
          "Add, update, and inspect array values using common array operations.",
          "const marks = [72, 88, 64];\nmarks.push(91);\nmarks[1] = 90;\nconsole.log(\"Marks:\", marks);\nconsole.log(\"Count:\", marks.length);\nconsole.log(\"Highest:\", Math.max(...marks));",
          "Marks: [72,90,64,91]\nCount: 4\nHighest: 91",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "array-methods": {
      "title": "Array Methods: map, filter, and reduce",
      "intro": "Array methods help transform and inspect lists without writing manual index loops.",
      "sections": [
        [
          "map transforms each item",
          "map returns a new array with one result for each original item.",
          "const prices = [2, 4, 6];\nconst doubled = prices.map(price => price * 2);\nconsole.log(doubled); // [4, 8, 12]"
        ],
        [
          "filter keeps matching items",
          "filter returns a new array containing items whose callback returned true.",
          "const numbers = [1, 2, 3, 4];\nconst even = numbers.filter(number => number % 2 === 0);"
        ],
        [
          "reduce combines items",
          "reduce carries an accumulated value through the array. Give it an initial value to make the result predictable.",
          "const numbers = [1, 2, 3];\nconst total = numbers.reduce((sum, number) => sum + number, 0);\nconsole.log(total); // 6"
        ],
        [
          "Other useful methods",
          "find returns the first matching item, some checks whether any match, every checks whether all match, and forEach runs a callback for each item."
        ],
        [
          "Filter, sort, and format products",
          "Combine filter(), sort(), and map() to build a useful product list. sort() mutates its array, so copy first.",
          "const products = [\n  { name: \"Keyboard\", price: 1299, category: \"accessories\" },\n  { name: \"USB cable\", price: 199, category: \"accessories\" },\n  { name: \"Monitor\", price: 8999, category: \"display\" },\n  { name: \"Mouse\", price: 599, category: \"accessories\" }\n];\nconst affordable = products\n  .filter(product => product.category === \"accessories\" && product.price < 1000)\n  .toSorted((a, b) => a.price - b.price)\n  .map(product => product.name + \": ₹\" + product.price);\nconsole.log(affordable.join(\"\\n\"));"
        ],
        [
          "Summarize order values with reduce()",
          "Use reduce() to calculate revenue and count orders over a threshold.",
          "const orders = [\n  { id: 101, total: 499 },\n  { id: 102, total: 1299 },\n  { id: 103, total: 799 },\n  { id: 104, total: 1999 }\n];\nconst revenue = orders.reduce((sum, order) => sum + order.total, 0);\nconst largeOrders = orders.filter(order => order.total >= 1000).length;\nconsole.log(\"Revenue: ₹\" + revenue);\nconsole.log(\"Orders of ₹1,000 or more:\", largeOrders);"
        ],
        [
          "Analyze product prices",
          "Use filter, map, and reduce to select products, display prices, and calculate the total.",
          "const products = [{ name: \"Mouse\", price: 499 }, { name: \"Keyboard\", price: 1299 }, { name: \"USB cable\", price: 199 }];\nconst affordable = products.filter(product => product.price < 600);\nconsole.log(\"Affordable:\", affordable.map(product => product.name));\nconsole.log(\"Total inventory value:\", products.reduce((sum, product) => sum + product.price, 0));",
          "Affordable: [\"Mouse\",\"USB cable\"]\nTotal inventory value: 1997",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "typed-arrays": {
      "title": "Typed Arrays",
      "intro": "Typed arrays represent numeric data in a fixed-width binary format. They are used for files, graphics, audio, and other low-level data.",
      "sections": [
        [
          "Create a typed array",
          "Each typed array stores one numeric type. Unlike a normal array, its length cannot grow.",
          "const bytes = new Uint8Array([10, 20, 30]);\nconsole.log(bytes[1]); // 20\nbytes[1] = 25;"
        ],
        [
          "ArrayBuffer",
          "An ArrayBuffer represents raw binary memory. Typed-array views interpret that memory as specific numeric values."
        ],
        [
          "Process sensor readings",
          "Typed arrays store numeric values efficiently in a fixed-type array.",
          "const sourceReadings = [21.4, 22.1, 20.8, 23.0];\nconst readings = new Float32Array(sourceReadings);\nconst average = Math.round((sourceReadings.reduce((sum, value) => sum + value, 0) / sourceReadings.length + 1e-10) * 100) / 100;\nconsole.log(\"Readings:\", [...readings]);\nconsole.log(\"Average:\", average.toFixed(2));",
          "Readings: [21.399999618530273,22.100000381469727,20.799999237060547,23]\nAverage: 21.83",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "objects": {
      "title": "JavaScript Objects",
      "intro": "An object stores related information as properties. A property has a key and a value.",
      "sections": [
        [
          "Create and read properties",
          "Use dot notation when the property name is known. Bracket notation works with dynamic names or names containing spaces.",
          "const student = { name: \"Kai\", score: 95 };\nconsole.log(student.name);\nstudent.score = 97;\nstudent.grade = \"A\";"
        ],
        [
          "Methods and nested data",
          "A method is a function stored on an object. Objects can contain other objects and arrays.",
          "const account = {\n  owner: \"Kai\",\n  balance: 50,\n  deposit(amount) {\n    this.balance += amount;\n  }\n};\naccount.deposit(10);"
        ],
        [
          "Inspect object properties",
          "Object.keys, Object.values, and Object.entries return arrays describing an object."
        ],
        [
          "Product inventory object",
          "Store related data together and use a method to update stock with validation.",
          "const product = {\n  name: \"Wireless Mouse\",\n  price: 899,\n  stock: 8,\n  sell(quantity) {\n    if (!Number.isInteger(quantity) || quantity <= 0) return \"Enter a positive whole quantity.\";\n    if (quantity > this.stock) return \"Not enough stock.\";\n    this.stock -= quantity;\n    return quantity + \" sold. Remaining stock: \" + this.stock;\n  }\n};\nconsole.log(product.sell(3));\nconsole.log(product.sell(10));"
        ],
        [
          "Build a student report",
          "Read properties and derive a summary from an object.",
          "const student = { name: \"Meera\", marks: [88, 76, 93, 81] };\nconst total = student.marks.reduce((sum, mark) => sum + mark, 0);\nconst average = total / student.marks.length;\nconst report = {\n  name: student.name,\n  total,\n  average: Number(average.toFixed(2)),\n  result: average >= 40 ? \"Pass\" : \"Fail\"\n};\nconsole.log(report);"
        ],
        [
          "Create a product inventory record",
          "Use an object to group related properties and calculate a stock value.",
          "const product = { name: \"Wireless Mouse\", price: 799, stock: 12, category: \"Accessories\" };\nconst stockValue = product.price * product.stock;\nconsole.log(`${product.name} (${product.category})`);\nconsole.log(\"Units:\", product.stock);\nconsole.log(\"Stock value: ₹\" + stockValue);",
          "Wireless Mouse (Accessories)\nUnits: 12\nStock value: ₹9588",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "destructuring": {
      "title": "Destructuring and Spread",
      "intro": "Destructuring extracts values into variables. Spread expands values from an array or object.",
      "sections": [
        [
          "Destructure arrays and objects",
          "You can assign defaults if a property or position is missing.",
          "const [first, second] = [\"red\", \"blue\"];\nconst { name, age = 0 } = { name: \"Lee\" };\nconsole.log(first, second, name, age);"
        ],
        [
          "Spread and rest",
          "Spread copies enumerable items into a new array or object. Rest gathers remaining values into an array.",
          "const oldList = [1, 2];\nconst newList = [...oldList, 3];\nconst user = { name: \"Lee\" };\nconst profile = { ...user, active: true };"
        ],
        [
          "Shallow copies",
          "Spread copies only one level. Nested objects remain shared references unless you copy those nested values too."
        ],
        [
          "Create a display card from object data",
          "Use destructuring and default values to prepare display-friendly information.",
          "const product = { name: \"Laptop stand\", price: 799, rating: 4.4 };\nconst { name, price, rating = \"Not rated\" } = product;\nconsole.log(name + \" — ₹\" + price + \" (rating \" + rating + \"/5)\");\nconst [first, second, ...remaining] = [\"HTML\", \"CSS\", \"JavaScript\", \"Git\"];\nconsole.log(\"Start with:\", first, \"and\", second);\nconsole.log(\"Then learn:\", remaining.join(\", \"));"
        ],
        [
          "Extract and combine order data",
          "Destructuring selects object properties, while spread creates a new combined object.",
          "const customer = { name: \"Ira\", city: \"Hyderabad\" };\nconst order = { id: 1042, total: 1599 };\nconst { name, city } = customer;\nconst fullOrder = { ...customer, ...order, status: \"confirmed\" };\nconsole.log(`${name} from ${city}`);\nconsole.log(fullOrder);",
          "Ira from Hyderabad\n{\"name\":\"Ira\",\"city\":\"Hyderabad\",\"id\":1042,\"total\":1599,\"status\":\"confirmed\"}",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "map-set": {
      "title": "Map and Set",
      "intro": "Map and Set are built-in collections with behavior that differs from ordinary objects and arrays.",
      "sections": [
        [
          "Map",
          "A Map stores key-value pairs and can use values of any type as keys. It preserves insertion order.",
          "const visits = new Map();\nvisits.set(\"home\", 3);\nconsole.log(visits.get(\"home\"));\nconsole.log(visits.has(\"home\"));"
        ],
        [
          "Set",
          "A Set stores unique values. Adding a duplicate does not create a second copy.",
          "const unique = new Set([1, 1, 2, 3]);\nunique.add(4);\nconsole.log([...unique]); // [1, 2, 3, 4]"
        ],
        [
          "Count product categories with Map",
          "Map stores a count for each category without relying on object property names.",
          "const products = [\n  { name: \"Mouse\", category: \"accessories\" },\n  { name: \"Keyboard\", category: \"accessories\" },\n  { name: \"Monitor\", category: \"display\" },\n  { name: \"Webcam\", category: \"accessories\" }\n];\nconst counts = new Map();\nfor (const product of products) {\n  counts.set(product.category, (counts.get(product.category) ?? 0) + 1);\n}\nfor (const [category, count] of counts) console.log(category + \": \" + count);"
        ],
        [
          "Remove duplicate tags",
          "A Set keeps only unique values; convert it back to an array when needed.",
          "const tags = [\"javascript\", \"html\", \"javascript\", \"css\", \"html\", \"security\"];\nconst uniqueTags = [...new Set(tags)];\nconsole.log(uniqueTags);\nconst scores = new Map([[\"Mina\", 88], [\"Rahul\", 76]]);\nscores.set(\"Mina\", 92);\nconsole.log(\"Mina:\", scores.get(\"Mina\"));",
          "[\"javascript\",\"html\",\"css\",\"security\"]\nMina: 92",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "dates": {
      "title": "JavaScript Dates",
      "intro": "Date represents a moment in time. Month numbers returned by getMonth start at zero, so January is 0.",
      "sections": [
        [
          "Create and inspect a date",
          "Use Date.now() for the current timestamp, or create a Date from an ISO date string.",
          "const today = new Date();\nconsole.log(today.getFullYear());\nconsole.log(today.getMonth() + 1); // human month\nconsole.log(today.toISOString());"
        ],
        [
          "Date and time caution",
          "Date parsing and time zones can surprise beginners. Prefer ISO 8601 strings and use Intl.DateTimeFormat for user-friendly display."
        ],
        [
          "Days until an event",
          "Calculate whole calendar days between today and a future date using UTC dates to avoid daylight-saving boundary errors.",
          "function daysUntil(dateText) {\n  const target = new Date(dateText + \"T00:00:00Z\");\n  if (Number.isNaN(target.getTime())) return \"Invalid date\";\n  const now = new Date();\n  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());\n  return Math.ceil((target.getTime() - todayUtc) / 86400000);\n}\nconsole.log(\"Days until 2027-01-01:\", daysUntil(\"2027-01-01\"));"
        ],
        [
          "Calculate days until a deadline",
          "Convert dates to timestamps to compare calendar days.",
          "const today = new Date(\"2026-10-18T00:00:00Z\");\nconst deadline = new Date(\"2026-11-01T00:00:00Z\");\nconst millisecondsPerDay = 24 * 60 * 60 * 1000;\nconst daysLeft = Math.ceil((deadline - today) / millisecondsPerDay);\nconsole.log(\"Days until deadline:\", daysLeft);",
          "Days until deadline: 14",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "regex": {
      "title": "Regular Expressions",
      "intro": "A regular expression (regex) describes a text pattern. It can search, test, or replace parts of a string.",
      "sections": [
        [
          "Test a pattern",
          "The test method returns true when the pattern is found. \\d means a digit and + means one or more.",
          "const hasDigits = /\\d+/.test(\"room 24\");\nconsole.log(hasDigits); // true"
        ],
        [
          "Find and replace",
          "The g flag means global matching. Regex is useful for simple pattern checks, but complex input validation needs careful rules.",
          "const words = \"red blue red\";\nconsole.log(words.replace(/red/g, \"green\"));"
        ],
        [
          "Validate a simple email shape",
          "A regular expression can catch common formatting mistakes, but it cannot prove an address exists or replace server-side verification.",
          "function looksLikeEmail(value) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);\n}\nconsole.log(looksLikeEmail(\"learner@example.com\")); // true\nconsole.log(looksLikeEmail(\"learner.example.com\")); // false\nconsole.log(looksLikeEmail(\"two@@example.com\"));     // false"
        ],
        [
          "Validate a simple student ID",
          "A regular expression can check whether text follows a defined pattern.",
          "const studentIds = [\"BCA2026\", \"MPC2025\", \"BCA26\", \"BCA@2026\"];\nconst pattern = /^BCA\\d{4}$/;\nstudentIds.forEach(id => console.log(id, pattern.test(id) ? \"Valid\" : \"Invalid\"));",
          "BCA2026 Valid\nMPC2025 Invalid\nBCA26 Invalid\nBCA@2026 Invalid",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "symbols-bigint": {
      "title": "Symbols and BigInt",
      "intro": "Symbol and BigInt are primitive JavaScript types for special cases: unique property keys and integers larger than Number can safely represent.",
      "sections": [
        [
          "Symbol",
          "Each call to Symbol creates a unique value. Symbols are often used as special property keys by libraries and JavaScript itself.",
          "const key = Symbol(\"id\");\nconst record = { [key]: 42 };\nconsole.log(record[key]);"
        ],
        [
          "BigInt",
          "Add n to an integer literal to create a BigInt. BigInt and Number cannot be mixed in arithmetic without explicit conversion.",
          "const huge = 9007199254740993n;\nconsole.log(huge + 2n);"
        ],
        [
          "Calculate a large integer exactly",
          "BigInt handles integers larger than Number.MAX_SAFE_INTEGER without losing integer precision.",
          "const accountId = 9007199254740993n;\nconst nextId = accountId + 2n;\nconsole.log(\"Account ID:\", accountId.toString());\nconsole.log(\"Next ID:\", nextId.toString());\nconst uniqueKey = Symbol(\"id\");\nconsole.log(\"Symbol key is unique:\", uniqueKey !== Symbol(\"id\"));",
          "Account ID: 9007199254740993\nNext ID: 9007199254740995\nSymbol key is unique: true",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "dom": {
      "title": "DOM Introduction",
      "intro": "The Document Object Model (DOM) is the browser’s in-memory tree of a webpage. JavaScript can find and change its nodes.",
      "sections": [
        [
          "Select an element",
          "Use getElementById or querySelector to find one element. querySelectorAll finds all elements matching a CSS selector.",
          "const heading = document.createElement(\"h1\");\nheading.textContent = \"A heading from JavaScript\";\ndocument.body.append(heading);\nconsole.log(heading.textContent);"
        ],
        [
          "Change page content",
          "Use textContent for plain text. Be careful with innerHTML when content may include user input because it can create security problems.",
          "const message = document.querySelector(\"#message\");\nmessage.textContent = \"Welcome!\";"
        ],
        [
          "Create and remove elements",
          "Use createElement, append, and remove to modify the page structure."
        ],
        [
          "Build a live shopping total",
          "Create elements and update the page when a quantity changes. This example runs in the Tryit preview.",
          "const products = [\n  { name: \"Notebook\", price: 50 },\n  { name: \"Pen\", price: 20 }\n];\nconst list = document.createElement(\"ul\");\nproducts.forEach(product => {\n  const item = document.createElement(\"li\");\n  item.textContent = product.name + \": ₹\" + product.price;\n  list.append(item);\n});\ndocument.body.append(list);\nconst total = products.reduce((sum, product) => sum + product.price, 0);\nconst summary = document.createElement(\"p\");\nsummary.textContent = \"Cart total: ₹\" + total;\ndocument.body.append(summary);"
        ],
        [
          "Create an accessible status message",
          "Update textContent rather than inserting an HTML string when showing a message.",
          "const button = document.createElement(\"button\");\nbutton.textContent = \"Check stock\";\nconst message = document.createElement(\"p\");\nmessage.setAttribute(\"role\", \"status\");\nbutton.addEventListener(\"click\", () => {\n  message.textContent = \"Stock checked: 8 items available.\";\n});\ndocument.body.append(button, message);"
        ],
        [
          "Update page content from JavaScript",
          "Select the result element and change its text. This runs in the Try It preview because it contains an element with id=result.",
          "const result = document.querySelector(\"#result\");\nresult.textContent = \"Your order has been confirmed!\";\nresult.style.color = \"green\";\nresult.style.fontWeight = \"bold\";",
          "The preview shows: Your order has been confirmed!",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "dom-elements": {
      "title": "Selecting and Changing DOM Elements",
      "intro": "After selecting an element, you can update its text, classes, attributes, and styles.",
      "sections": [
        [
          "Text, classes, and attributes",
          "classList is usually better than changing the style directly because CSS remains responsible for presentation.",
          "const card = document.createElement(\"div\");\ncard.className = \"card\";\ndocument.body.append(card);\ncard.classList.add(\"featured\");\ncard.setAttribute(\"aria-live\", \"polite\");"
        ],
        [
          "Create nodes safely",
          "textContent treats input as text. Use it for content that comes from a user or remote source.",
          "const item = document.createElement(\"li\");\nitem.textContent = \"New item\";\ndocument.querySelector(\"ul\").append(item);"
        ],
        [
          "Build a dynamic list item",
          "Create an element, set its text safely, and append it to the page.",
          "const list = document.createElement(\"ul\");\n[\"Learn variables\", \"Practice arrays\", \"Build a project\"].forEach(task => {\n  const item = document.createElement(\"li\");\n  item.textContent = task;\n  list.append(item);\n});\ndocument.body.append(list);\ndocument.querySelector(\"#result\").textContent = \"Study checklist created below.\";",
          "The preview shows a three-item study checklist.",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "events": {
      "title": "JavaScript Events",
      "intro": "Events tell your code that something happened, such as a click, a key press, or a form submission.",
      "sections": [
        [
          "Listen for an event",
          "addEventListener attaches a function that runs when an event occurs. The event object provides details about it.",
          "const button = document.createElement(\"button\");\nbutton.textContent = \"Click me\";\ndocument.body.append(button);\nbutton.addEventListener(\"click\", event => {\n  console.log(\"Clicked\", event.currentTarget);\n});\nbutton.click();"
        ],
        [
          "Event bubbling and delegation",
          "Many events bubble from a child toward its parents. A parent can handle events from many children using event.target, which is called delegation.",
          "document.querySelector(\"ul\").addEventListener(\"click\", event => {\n  if (event.target.matches(\"li\")) event.target.classList.toggle(\"done\");\n});"
        ],
        [
          "Prevent a default action",
          "event.preventDefault() stops a browser default such as navigating to a link or submitting a form. Use it only when your code replaces that behavior."
        ],
        [
          "Interactive quantity calculator",
          "Respond to input events and update a total as the user changes a quantity.",
          "const label = document.createElement(\"label\");\nlabel.textContent = \"Quantity (1–10): \";\nconst input = document.createElement(\"input\");\ninput.type = \"number\";\ninput.min = \"1\";\ninput.max = \"10\";\ninput.value = \"2\";\nconst output = document.createElement(\"p\");\nfunction updateTotal() {\n  const quantity = Number(input.value);\n  output.textContent = Number.isInteger(quantity) && quantity >= 1 && quantity <= 10\n    ? \"Total: ₹\" + (quantity * 249)\n    : \"Enter a whole quantity from 1 to 10.\";\n}\ninput.addEventListener(\"input\", updateTotal);\nlabel.append(input);\ndocument.body.append(label, output);\nupdateTotal();"
        ],
        [
          "Respond to a button click",
          "Create a button and update a message when the user clicks it.",
          "const button = document.createElement(\"button\");\nbutton.textContent = \"Add 1 to score\";\nconst score = document.createElement(\"p\");\nlet points = 0;\nscore.textContent = \"Score: 0\";\nbutton.addEventListener(\"click\", () => { points += 1; score.textContent = `Score: ${points}`; });\ndocument.body.append(button, score);\ndocument.querySelector(\"#result\").textContent = \"Click the button to increase the score.\";",
          "The preview shows a button; each click increases the score.",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "forms": {
      "title": "Forms and Validation",
      "intro": "Forms collect information from people. Validate input for a helpful experience, and always validate again on a server for security.",
      "sections": [
        [
          "Read form values",
          "Listen to the submit event and call preventDefault if the page should process the form with JavaScript.",
          "const form = document.createElement(\"form\");\nconst input = document.createElement(\"input\");\ninput.name = \"email\";\ninput.value = \"learner@example.com\";\nform.append(input);\ndocument.body.append(form);\nform.addEventListener(\"submit\", event => {\n  event.preventDefault();\n  console.log(new FormData(form).get(\"email\"));\n});\nform.requestSubmit();"
        ],
        [
          "Native and custom validation",
          "HTML input types and required attributes provide useful browser validation. JavaScript can add more checks and accessible messages. Never rely only on client-side validation."
        ],
        [
          "Validate a registration form",
          "Build a small form and display validation feedback without reloading the page.",
          "const form = document.createElement(\"form\");\nconst nameInput = document.createElement(\"input\");\nnameInput.placeholder = \"Your name\";\nnameInput.required = true;\nconst emailInput = document.createElement(\"input\");\nemailInput.type = \"email\";\nemailInput.placeholder = \"Email address\";\nemailInput.required = true;\nconst submit = document.createElement(\"button\");\nsubmit.textContent = \"Validate\";\nconst feedback = document.createElement(\"p\");\nfeedback.setAttribute(\"role\", \"status\");\nform.append(nameInput, emailInput, submit);\nform.addEventListener(\"submit\", event => {\n  event.preventDefault();\n  feedback.textContent = form.reportValidity() ? \"Form looks valid.\" : \"Please complete the required fields.\";\n});\ndocument.body.append(form, feedback);"
        ],
        [
          "Validate a registration form",
          "Check required values and show feedback without sending data to a server.",
          "const form = document.createElement(\"form\");\nform.innerHTML = '<label>Name <input id=\"studentName\" required></label> <button>Check</button>';\nconst feedback = document.createElement(\"p\");\nform.addEventListener(\"submit\", event => {\n  event.preventDefault();\n  const name = form.querySelector(\"#studentName\").value.trim();\n  feedback.textContent = name ? `Welcome, ${name}!` : \"Please enter your name.\";\n});\ndocument.body.append(form, feedback);\ndocument.querySelector(\"#result\").textContent = \"Enter a name and submit the form.\";",
          "The preview shows a form with a welcome message after submission.",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "storage": {
      "title": "JSON and Browser Storage",
      "intro": "JSON is a text format for data exchange. localStorage keeps string values in a browser between visits.",
      "sections": [
        [
          "Convert objects to JSON",
          "JSON.stringify converts supported data to text; JSON.parse converts valid JSON text back to data.",
          "const settings = { theme: \"dark\", fontSize: 16 };\nconst text = JSON.stringify(settings);\nconst restored = JSON.parse(text);"
        ],
        [
          "Use localStorage",
          "Storage values are strings, so convert objects to JSON. Do not store passwords or sensitive secrets in browser storage. The isolated Tryit frame may block browser storage.",
          "try {\n  localStorage.setItem(\"settings\", JSON.stringify({ theme: \"dark\" }));\n  const settings = JSON.parse(localStorage.getItem(\"settings\") ?? \"{}\");\n  console.log(settings.theme);\n} catch (error) {\n  console.warn(\"Storage is blocked in this context:\", error.name);\n}"
        ],
        [
          "Storage alternatives",
          "sessionStorage lasts for the tab session. IndexedDB is designed for larger structured client-side data."
        ],
        [
          "Save a to-do list locally",
          "Persist a small list between refreshes. The example catches storage errors and validates stored data.",
          "const storageKey = \"projectx-demo-tasks\";\nlet tasks = [];\ntry {\n  const saved = JSON.parse(localStorage.getItem(storageKey) || \"[]\");\n  if (Array.isArray(saved) && saved.every(item => typeof item === \"string\")) tasks = saved;\n} catch (error) {\n  console.log(\"Saved data could not be read:\", error.message);\n}\ntasks.push(\"Practise array methods\");\ntry {\n  localStorage.setItem(storageKey, JSON.stringify(tasks));\n  console.log(\"Saved tasks:\", tasks);\n} catch (error) {\n  console.log(\"Could not save tasks:\", error.message);\n}"
        ],
        [
          "Save a preferred theme",
          "Save a small preference and read it back. The isolated Tryit preview provides temporary in-memory storage for this demonstration; it resets when you run the code again.",
          "const preferences = { theme: \"dark\", fontSize: 16 };\nlocalStorage.setItem(\"demo-preferences\", JSON.stringify(preferences));\nconst saved = JSON.parse(localStorage.getItem(\"demo-preferences\"));\nconsole.log(\"Saved theme:\", saved.theme);\nconsole.log(\"Font size:\", saved.fontSize);",
          "Saved theme: dark\nFont size: 16",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "json": {
      "title": "JavaScript JSON",
      "intro": "JSON (JavaScript Object Notation) is a text format used to exchange data. JSON syntax is stricter than JavaScript object syntax.",
      "sections": [
        [
          "Convert between objects and JSON",
          "JSON.stringify turns supported data into a string. JSON.parse reads valid JSON text. Invalid JSON throws a SyntaxError.",
          "const user = { name: \"Ari\", active: true };\nconst text = JSON.stringify(user);\nconst restored = JSON.parse(text);\nconsole.log(restored.name);"
        ],
        [
          "JSON limitations",
          "JSON supports objects, arrays, strings, numbers, booleans, and null. Functions and undefined values are not represented as JSON data."
        ],
        [
          "Convert API-style JSON data",
          "Parse a JSON string, inspect its values, and serialize a smaller result.",
          "const jsonText = '{\"id\":42,\"name\":\"Notebook\",\"price\":75,\"inStock\":true}';\nconst product = JSON.parse(jsonText);\nconst summary = { label: product.name, priceWithTax: Number((product.price * 1.05).toFixed(2)) };\nconsole.log(\"Product:\", product.name);\nconsole.log(\"In stock:\", product.inStock);\nconsole.log(JSON.stringify(summary, null, 2));"
        ],
        [
          "Convert an order to JSON",
          "JSON.stringify serializes an object; JSON.parse turns valid JSON text back into an object.",
          "const order = { id: 501, items: 2, total: 799.5 };\nconst jsonText = JSON.stringify(order, null, 2);\nconsole.log(jsonText);\nconst restored = JSON.parse(jsonText);\nconsole.log(\"Order total:\", restored.total);",
          "{\n  \"id\": 501,\n  \"items\": 2,\n  \"total\": 799.5\n}\nOrder total: 799.5",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "callbacks": {
      "title": "Callbacks",
      "intro": "A callback is a function passed to another function so it can be called later. Callbacks are common in events and older asynchronous APIs.",
      "sections": [
        [
          "Pass a function",
          "The function is passed without parentheses; the receiving code decides when to call it.",
          "function greet(name, callback) {\n  callback(`Hello, ${name}`);\n}\ngreet(\"Ari\", message => console.log(message));"
        ],
        [
          "Asynchronous callbacks",
          "Timers and event handlers call your callback later. Deeply nested callbacks can become hard to read; Promises and async/await help organize asynchronous work.",
          "setTimeout(() => {\n  console.log(\"One second later\");\n}, 1000);"
        ],
        [
          "Process orders with a callback",
          "Pass a function to decide what happens after each order is processed.",
          "const orders = [\n  { id: 1, total: 499 },\n  { id: 2, total: 1499 },\n  { id: 3, total: 799 }\n];\nfunction processOrders(items, callback) {\n  items.forEach((item, index) => callback(item, index));\n}\nprocessOrders(orders, (order, index) => {\n  const status = order.total >= 1000 ? \"Priority\" : \"Standard\";\n  console.log(\"Order \" + order.id + \" (\" + (index + 1) + \"): \" + status);\n});"
        ],
        [
          "Process tasks with a callback",
          "Pass a function to another function to customize what happens after each task.",
          "function processTasks(tasks, onTask) {\n  tasks.forEach((task, index) => onTask(task, index + 1));\n}\nprocessTasks([\"Read lesson\", \"Run example\", \"Solve exercise\"], (task, number) => {\n  console.log(`${number}. ${task}`);\n});",
          "1. Read lesson\n2. Run example\n3. Solve exercise",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "promises": {
      "title": "JavaScript Promises",
      "intro": "A Promise represents the eventual result of an asynchronous operation. It is pending, fulfilled, or rejected.",
      "sections": [
        [
          "Handle a Promise",
          "then handles success, catch handles rejection, and finally runs after either outcome.",
          "const task = Promise.resolve(\"Finished\");\ntask\n  .then(result => console.log(result))\n  .catch(error => console.error(error))\n  .finally(() => console.log(\"Done\"));"
        ],
        [
          "Combine Promises",
          "Promise.all waits for every task and rejects if one rejects. Promise.allSettled waits for every result, including failures."
        ],
        [
          "Run tasks and handle a failure",
          "Promise.all runs independent tasks concurrently. A rejection is handled in catch().",
          "function loadProfile() {\n  return Promise.resolve({ id: 7, name: \"Aarav\" });\n}\nfunction loadOrders() {\n  return Promise.resolve([{ id: 501, total: 799 }, { id: 502, total: 249 }]);\n}\nPromise.all([loadProfile(), loadOrders()])\n  .then(([profile, orders]) => {\n    const total = orders.reduce((sum, order) => sum + order.total, 0);\n    console.log(profile.name + \" has \" + orders.length + \" orders.\");\n    console.log(\"Order total: ₹\" + total);\n  })\n  .catch(error => console.error(\"Could not load dashboard:\", error.message));"
        ],
        [
          "Handle a successful or failed task",
          "A Promise represents a result that may become available later.",
          "function checkStock(quantity) {\n  return new Promise((resolve, reject) => {\n    if (quantity <= 5) resolve(`Only ${quantity} items available`);\n    else reject(new Error(\"Requested quantity exceeds demo stock\"));\n  });\n}\ncheckStock(3).then(console.log).catch(error => console.log(error.message));",
          "Only 3 items available",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "async-await": {
      "title": "async and await",
      "intro": "async/await is syntax for working with Promises. It lets asynchronous code read in a top-to-bottom style.",
      "sections": [
        [
          "Wait for a Promise",
          "An async function always returns a Promise. await pauses that function until the Promise settles; it does not block the whole browser.",
          "async function getMessage() {\n  const message = await Promise.resolve(\"Hello\");\n  return message;\n}\ngetMessage().then(console.log);"
        ],
        [
          "Handle failures",
          "Use try/catch around awaited work to handle rejected Promises.",
          "async function load() {\n  try {\n    const result = await Promise.resolve(\"Loaded\");\n    console.log(result);\n  } catch (error) {\n    console.error(error);\n  }\n}"
        ],
        [
          "Retry a temporary operation",
          "Use async/await with a bounded retry count and clear error handling. This is a local demonstration, not a real network request.",
          "async function attemptOperation(maxAttempts = 3) {\n  for (let attempt = 1; attempt <= maxAttempts; attempt++) {\n    try {\n      if (attempt < 2) throw new Error(\"Temporary issue\");\n      return \"Operation succeeded on attempt \" + attempt;\n    } catch (error) {\n      console.log(\"Attempt \" + attempt + \" failed: \" + error.message);\n      if (attempt === maxAttempts) throw error;\n    }\n  }\n}\nattemptOperation()\n  .then(console.log)\n  .catch(error => console.error(\"Final failure:\", error.message));"
        ],
        [
          "Load sample data asynchronously",
          "Use async/await with try/catch to make asynchronous code easier to read.",
          "function getProfile() {\n  return new Promise(resolve => setTimeout(() => resolve({ name: \"Nila\", course: \"BCA\" }), 100));\n}\nasync function showProfile() {\n  try { const profile = await getProfile(); console.log(`${profile.name} studies ${profile.course}.`); }\n  catch (error) { console.error(\"Could not load profile:\", error.message); }\n}\nshowProfile();",
          "Nila studies BCA.",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "fetch": {
      "title": "Fetch and APIs",
      "intro": "An API lets software exchange information. The Fetch API sends HTTP requests and commonly receives JSON.",
      "sections": [
        [
          "Make a request",
          "fetch returns a Promise. A network response with an HTTP error status does not automatically reject, so check response.ok.",
          "async function loadPost() {\n  const response = await fetch(\"https://jsonplaceholder.typicode.com/posts/1\");\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  const post = await response.json();\n  console.log(post.title);\n}"
        ],
        [
          "Send data and handle errors",
          "Use options such as method, headers, and body for requests that send data. Handle network errors and show useful feedback to users."
        ],
        [
          "Fetch and display sample posts",
          "Check response.ok because fetch does not reject just because the server returns an HTTP error status.",
          "async function loadPosts() {\n  try {\n    const response = await fetch(\"https://jsonplaceholder.typicode.com/posts?_limit=3\");\n    if (!response.ok) throw new Error(\"HTTP status \" + response.status);\n    const posts = await response.json();\n    console.log(posts.map(post => post.id + \". \" + post.title).join(\"\\n\"));\n  } catch (error) {\n    console.error(\"Could not load posts. Check your connection and try again:\", error.message);\n  }\n}\nloadPosts();"
        ],
        [
          "Fetch public sample data safely",
          "This browser example fetches a public JSONPlaceholder record and handles HTTP and network errors. It requires internet access.",
          "async function loadPost() {\n  try {\n    const response = await fetch(\"https://jsonplaceholder.typicode.com/posts/1\");\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    const post = await response.json();\n    console.log(\"Title:\", post.title);\n    console.log(\"Body:\", post.body);\n  } catch (error) { console.log(\"Request failed:\", error.message); }\n}\nloadPost();",
          "With internet access, prints the title and body of sample post 1. Otherwise prints a request error.",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "classes": {
      "title": "JavaScript Classes",
      "intro": "A class is a syntax for creating objects with shared behavior. JavaScript classes use prototypes underneath.",
      "sections": [
        [
          "Create instances",
          "constructor runs when you use new. Methods are shared by instances through the class prototype.",
          "class Person {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `Hi, ${this.name}`;\n  }\n}\nconst person = new Person(\"Mika\");"
        ],
        [
          "Inheritance",
          "extends creates a subclass. Call super() before using this inside a subclass constructor.",
          "class Student extends Person {\n  constructor(name, course) {\n    super(name);\n    this.course = course;\n  }\n}"
        ],
        [
          "Shopping cart class",
          "Use a class to keep related data and behavior together, with basic validation for quantities.",
          "class CartItem {\n  constructor(name, price, quantity = 1) {\n    if (!name || !Number.isFinite(price) || price < 0) throw new Error(\"Invalid item details\");\n    this.name = name;\n    this.price = price;\n    this.quantity = quantity;\n  }\n  get total() { return this.price * this.quantity; }\n  setQuantity(quantity) {\n    if (!Number.isInteger(quantity) || quantity < 1) throw new Error(\"Quantity must be a positive whole number\");\n    this.quantity = quantity;\n  }\n}\nconst item = new CartItem(\"Keyboard\", 1299, 2);\nconsole.log(item.name + \" total: ₹\" + item.total);\nitem.setQuantity(3);\nconsole.log(\"Updated total: ₹\" + item.total);"
        ],
        [
          "Create a shopping cart class",
          "Use a class to keep cart data and related behavior together.",
          "class ShoppingCart {\n  constructor() { this.items = []; }\n  add(name, price, quantity = 1) { this.items.push({ name, price, quantity }); }\n  total() { return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0); }\n}\nconst cart = new ShoppingCart();\ncart.add(\"Notebook\", 50, 2);\ncart.add(\"Pen\", 12, 3);\nconsole.log(\"Cart total: ₹\" + cart.total());",
          "Cart total: ₹136",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "prototypes": {
      "title": "Prototypes and Inheritance",
      "intro": "Objects can inherit properties from another object through a prototype chain. Classes are a more familiar syntax over this model.",
      "sections": [
        [
          "Prototype lookup",
          "When a property is not found directly on an object, JavaScript checks its prototype, then the prototype’s prototype.",
          "const animal = { eat() { return \"eating\"; } };\nconst rabbit = Object.create(animal);\nconsole.log(rabbit.eat());"
        ],
        [
          "Own properties",
          "Object.hasOwn checks whether a property belongs directly to an object rather than being inherited."
        ],
        [
          "Share a method through a prototype",
          "Objects can share behavior through their prototype instead of duplicating a method on every object.",
          "function Device(name) { this.name = name; }\nDevice.prototype.describe = function () { return `${this.name} is ready`; };\nconst laptop = new Device(\"Laptop\");\nconst tablet = new Device(\"Tablet\");\nconsole.log(laptop.describe());\nconsole.log(tablet.describe());\nconsole.log(\"Shared method:\", laptop.describe === tablet.describe);",
          "Laptop is ready\nTablet is ready\nShared method: true",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "execution-context": {
      "title": "Execution Context and Strict Mode",
      "intro": "An execution context is the environment JavaScript uses while running code. Scope rules determine how names are looked up.",
      "sections": [
        [
          "The call stack",
          "Calling a function adds work to the call stack. Returning from the function removes that work. Deep or endless calls can overflow the stack.",
          "function first() { second(); }\nfunction second() { console.log(\"Call stack\"); }\nfirst();"
        ],
        [
          "Strict mode",
          "Strict mode catches certain unsafe mistakes. JavaScript modules and class bodies use strict mode automatically.",
          "\"use strict\";\nconst answer = 42;\nconsole.log(answer);"
        ],
        [
          "Use strict mode to catch mistakes",
          "Strict mode helps surface certain programming errors rather than silently accepting them.",
          "\"use strict\";\nfunction calculateArea(width, height) {\n  if (width <= 0 || height <= 0) throw new RangeError(\"Dimensions must be positive\");\n  return width * height;\n}\nconsole.log(\"Area:\", calculateArea(8, 5));\ntry { calculateArea(-2, 5); } catch (error) { console.log(error.name + \": \" + error.message); }",
          "Area: 40\nRangeError: Dimensions must be positive",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "iterators-generators": {
      "title": "Iterators and Generators",
      "intro": "An iterable can provide values one at a time. Arrays and strings are iterable, which is why they work with for...of.",
      "sections": [
        [
          "Iterator protocol",
          "An iterator has a next() method that returns an object with value and done properties.",
          "const iterator = [\"a\", \"b\"][Symbol.iterator]();\nconsole.log(iterator.next());\nconsole.log(iterator.next());"
        ],
        [
          "Generator functions",
          "A generator uses function* and yield to pause and resume, producing an iterator.",
          "function* steps() {\n  yield \"first\";\n  yield \"second\";\n}\nfor (const step of steps()) console.log(step);"
        ],
        [
          "Generate ticket numbers on demand",
          "A generator pauses at yield and resumes when next() is called.",
          "function* ticketNumbers(start) {\n  let number = start;\n  while (true) yield `T-${number++}`;\n}\nconst tickets = ticketNumbers(201);\nconsole.log(tickets.next().value);\nconsole.log(tickets.next().value);\nconsole.log(tickets.next().value);",
          "T-201\nT-202\nT-203",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "weak-collections": {
      "title": "WeakMap and WeakSet",
      "intro": "WeakMap and WeakSet are collections designed to associate data with objects without keeping those objects alive solely because of the collection.",
      "sections": [
        [
          "WeakMap",
          "WeakMap keys must be objects (or non-registered symbols in current JavaScript engines). It is not enumerable, so it does not expose all its keys.",
          "const privateData = new WeakMap();\nconst user = {};\nprivateData.set(user, { visits: 1 });\nconsole.log(privateData.get(user).visits);"
        ],
        [
          "WeakSet",
          "WeakSet stores object references and supports add, has, and delete. Use Map or Set instead when you need to list the contents."
        ],
        [
          "Track temporary object metadata",
          "WeakMap associates metadata with an object without making the key itself strongly reachable.",
          "const privateNotes = new WeakMap();\nconst user = { id: 17, name: \"Ravi\" };\nprivateNotes.set(user, { lastViewed: \"dashboard\" });\nconsole.log(privateNotes.get(user).lastViewed);\nconsole.log(\"Has metadata:\", privateNotes.has(user));",
          "dashboard\nHas metadata: true",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "modules": {
      "title": "JavaScript Modules",
      "intro": "Modules split code into files with explicit imports and exports. This makes larger programs easier to organize.",
      "sections": [
        [
          "Export and import",
          "A named export is imported by its name. A default export can have a different local name. The short runnable example below demonstrates the value; use the type=\"module\" script pattern in the next lesson to practice a real export/import across files.",
          "const topic = \"JavaScript modules\";\nconsole.log(topic);"
        ],
        [
          "Use modules in a browser",
          "Add type=\"module\" to a script tag. Module scripts are deferred automatically and generally need to be served over HTTP rather than opened as file URLs.",
          "<script type=\"module\" src=\"app.js\"></script>"
        ],
        [
          "Prepare a reusable calculation",
          "In a real module project, export this function from one file and import it in another. This inline example demonstrates the reusable function without requiring module loading.",
          "function calculateGST(amount, rate = 0.18) {\n  if (amount < 0 || rate < 0) throw new RangeError(\"Amount and rate must be non-negative\");\n  return Number((amount * rate).toFixed(2));\n}\nconsole.log(\"GST:\", calculateGST(1000));\nconsole.log(\"GST at 5%:\", calculateGST(1000, 0.05));",
          "GST: 180\nGST at 5%: 50",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "errors": {
      "title": "Errors and Exceptions",
      "intro": "An error describes something that went wrong. Handling expected failures helps your program respond instead of stopping unexpectedly.",
      "sections": [
        [
          "try, catch, and finally",
          "The catch block handles an error thrown inside try. finally runs whether the operation succeeds or fails.",
          "try {\n  JSON.parse(\"{ invalid }\");\n} catch (error) {\n  console.log(\"Could not read JSON:\", error.message);\n} finally {\n  console.log(\"Finished\");\n}"
        ],
        [
          "Throw meaningful errors",
          "Throw an Error object with a useful message when a function receives data it cannot handle. Do not hide unexpected errors with empty catch blocks."
        ],
        [
          "Handle invalid calculator input",
          "Validate inputs and throw a useful error rather than silently returning a misleading result.",
          "function divide(a, b) {\n  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new TypeError(\"Both inputs must be finite numbers.\");\n  if (b === 0) throw new RangeError(\"Cannot divide by zero.\");\n  return a / b;\n}\nfor (const [a, b] of [[10, 2], [10, 0], [\"ten\", 2]]) {\n  try {\n    console.log(a + \" ÷ \" + b + \" = \" + divide(a, b));\n  } catch (error) {\n    console.log(error.name + \": \" + error.message);\n  }\n}"
        ],
        [
          "Handle invalid calculator input",
          "Validate input and catch errors so a bad value produces a useful message.",
          "function divide(a, b) {\n  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new TypeError(\"Both values must be numbers\");\n  if (b === 0) throw new RangeError(\"Cannot divide by zero\");\n  return a / b;\n}\nfor (const [a, b] of [[10, 2], [10, 0], [\"x\", 3]]) {\n  try { console.log(`${a} / ${b} = ${divide(a, b)}`); }\n  catch (error) { console.log(error.name + \": \" + error.message); }\n}",
          "10 / 2 = 5\nRangeError: Cannot divide by zero\nTypeError: Both values must be numbers",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "event-loop": {
      "title": "The JavaScript Event Loop",
      "intro": "JavaScript usually runs one piece of synchronous code at a time. The event loop coordinates queued callbacks so asynchronous work can run later.",
      "sections": [
        [
          "Synchronous order",
          "The current call stack must finish before queued callbacks run. Promise callbacks (microtasks) run before timer callbacks (tasks) after the current stack.",
          "console.log(\"A\");\nsetTimeout(() => console.log(\"C\"), 0);\nPromise.resolve().then(() => console.log(\"B\"));\nconsole.log(\"D\");\n// A, D, B, C"
        ],
        [
          "Why this matters",
          "Long synchronous work blocks the page from responding. Break up expensive work or move suitable computation to a Web Worker."
        ],
        [
          "Understand synchronous and asynchronous order",
          "Synchronous code runs first; queued microtasks run before timer callbacks.",
          "console.log(\"1. Start\");\nsetTimeout(() => console.log(\"4. Timer callback\"), 0);\nPromise.resolve().then(() => console.log(\"3. Promise callback\"));\nconsole.log(\"2. End\");",
          "1. Start\n2. End\n3. Promise callback\n4. Timer callback",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "web-apis": {
      "title": "Browser Web APIs",
      "intro": "Browsers provide APIs in addition to the JavaScript language. These interfaces let a page work with time, URLs, the clipboard, and more.",
      "sections": [
        [
          "Timers",
          "setTimeout schedules one callback; setInterval schedules repeated callbacks. Clear timers when they are no longer needed.",
          "const timerId = setTimeout(() => {\n  console.log(\"Time is up\");\n}, 1000);\nclearTimeout(timerId);"
        ],
        [
          "URL and clipboard",
          "The URL class safely reads and builds URLs. Clipboard access requires browser permission and a secure context in most browsers.",
          "const url = new URL(\"https://example.com/search?q=js\");\nconsole.log(url.searchParams.get(\"q\"));"
        ],
        [
          "Browser API versus JavaScript",
          "document, fetch, and localStorage are browser-provided APIs; they are not part of the ECMAScript language itself."
        ],
        [
          "Create a cancellable countdown",
          "Use a browser timer and clearInterval so the timer can be stopped. The short demo stops automatically.",
          "let seconds = 3;\nconsole.log(\"Countdown:\", seconds);\nconst timer = setInterval(() => {\n  seconds -= 1;\n  console.log(\"Countdown:\", seconds);\n  if (seconds <= 0) { clearInterval(timer); console.log(\"Time is up!\"); }\n}, 500);",
          "Countdown: 3, then 2, 1, 0, followed by Time is up!",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "debugging": {
      "title": "Debugging JavaScript",
      "intro": "Debugging means finding and fixing the cause of a problem, not just changing code until it seems to work.",
      "sections": [
        [
          "Read the error",
          "Look at the error type, message, and stack trace. The first relevant line usually points to where the problem began.",
          "const value = 10;\nconsole.log(value);"
        ],
        [
          "Use developer tools",
          "Use console.log for quick inspection, breakpoints to pause execution, and the Network panel to inspect API requests. Remove noisy debugging output before release."
        ],
        [
          "Find the source of a wrong total",
          "Log intermediate values and compare them with expected values to locate a calculation mistake.",
          "const prices = [120, 80, 50];\nconst quantities = [2, 1, 3];\nlet total = 0;\nfor (let index = 0; index < prices.length; index++) {\n  const lineTotal = prices[index] * quantities[index];\n  console.log(\"Item \" + (index + 1) + \": \" + prices[index] + \" × \" + quantities[index] + \" = \" + lineTotal);\n  total += lineTotal;\n}\nconsole.log(\"Expected total: 470\");\nconsole.log(\"Actual total:\", total);\nconsole.assert(total === 470, \"Check prices and quantities\");"
        ],
        [
          "Trace a calculation with useful logs",
          "Log intermediate values to find where a result starts to differ from expectations.",
          "const prices = [120, 80, 50];\nlet subtotal = 0;\nfor (const price of prices) {\n  subtotal += price;\n  console.log(\"Added:\", price, \"Subtotal:\", subtotal);\n}\nconst discount = subtotal >= 200 ? 20 : 0;\nconsole.log(\"Final total:\", subtotal - discount);",
          "Added: 120 Subtotal: 120\nAdded: 80 Subtotal: 200\nAdded: 50 Subtotal: 250\nFinal total: 230",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    },
    "best-practices": {
      "title": "JavaScript Best Practices",
      "intro": "Good habits make code easier to understand, test, and change as a project grows.",
      "sections": [
        [
          "Write readable code",
          "Use clear names, small functions, consistent formatting, and const by default. Prefer direct, simple logic over clever shortcuts."
        ],
        [
          "Handle data carefully",
          "Validate external input, handle asynchronous errors, and avoid inserting untrusted strings with innerHTML. Client-side checks do not replace server-side validation."
        ],
        [
          "Keep learning",
          "Practice with small projects, read error messages, and learn browser APIs as you need them. JavaScript changes over time, so use modern standards and documentation."
        ],
        [
          "Build a small pure utility",
          "A pure function gives the same output for the same input and does not modify external state.",
          "function summarizeScores(scores) {\n  if (!Array.isArray(scores) || scores.length === 0) return { count: 0, average: null };\n  if (!scores.every(score => Number.isFinite(score) && score >= 0 && score <= 100)) {\n    throw new TypeError(\"Scores must be numbers from 0 to 100.\");\n  }\n  const total = scores.reduce((sum, score) => sum + score, 0);\n  return { count: scores.length, total, average: Number((total / scores.length).toFixed(2)) };\n}\nconsole.log(summarizeScores([78, 91, 84]));\nconsole.log(summarizeScores([]));"
        ],
        [
          "Validate before calculating",
          "Use descriptive names, early validation, and a small reusable function.",
          "function calculateAverage(marks) {\n  if (!Array.isArray(marks) || marks.length === 0) return null;\n  if (marks.some(mark => !Number.isFinite(mark) || mark < 0 || mark > 100)) {\n    throw new RangeError(\"Every mark must be between 0 and 100\");\n  }\n  return marks.reduce((sum, mark) => sum + mark, 0) / marks.length;\n}\nconsole.log(\"Average:\", calculateAverage([78, 84, 92]));\nconsole.log(\"Empty list:\", calculateAverage([]));",
          "Average: 84.66666666666667\nEmpty list: null",
          "Try changing the sample values, run the program, and explain why the output changes."
        ]
      ]
    }
  },
  "groups": [
    {
      "id": "getting-started",
      "title": "Getting Started",
      "level": "Beginner",
      "objectives": [
        "Explain what JavaScript does in a web page",
        "Run a first statement and read its output"
      ],
      "lessonIds": [
        "intro",
        "setup",
        "output",
        "syntax"
      ]
    },
    {
      "id": "fundamentals",
      "title": "JavaScript Fundamentals",
      "level": "Beginner",
      "objectives": [
        "Store and inspect values",
        "Choose actions with conditions and loops"
      ],
      "lessonIds": [
        "variables",
        "let-const",
        "modern-syntax",
        "data-types",
        "type-conversion",
        "operators",
        "conditions",
        "switch",
        "loops"
      ]
    },
    {
      "id": "functions-data",
      "title": "Functions and Data",
      "level": "Intermediate",
      "objectives": [
        "Write reusable functions",
        "Work with JavaScript collections and built-in objects"
      ],
      "lessonIds": [
        "functions",
        "scope",
        "this",
        "closures",
        "recursion",
        "strings",
        "numbers",
        "internationalization",
        "arrays",
        "array-methods",
        "typed-arrays",
        "objects",
        "destructuring",
        "map-set",
        "dates",
        "regex",
        "symbols-bigint"
      ]
    },
    {
      "id": "browser",
      "title": "Browser JavaScript",
      "level": "Intermediate",
      "objectives": [
        "Select and update page elements",
        "Respond to user input and store browser data"
      ],
      "lessonIds": [
        "dom",
        "dom-elements",
        "events",
        "forms",
        "json",
        "storage"
      ]
    },
    {
      "id": "asynchronous",
      "title": "Asynchronous JavaScript",
      "level": "Intermediate",
      "objectives": [
        "Explain asynchronous execution",
        "Use Promises and async/await for delayed work"
      ],
      "lessonIds": [
        "callbacks",
        "promises",
        "async-await",
        "fetch",
        "event-loop",
        "web-apis"
      ]
    },
    {
      "id": "advanced",
      "title": "Advanced JavaScript",
      "level": "Advanced",
      "objectives": [
        "Understand object behavior and code organization",
        "Debug, test, and improve real programs"
      ],
      "lessonIds": [
        "classes",
        "prototypes",
        "execution-context",
        "iterators-generators",
        "weak-collections",
        "modules",
        "errors",
        "debugging",
        "testing",
        "performance",
        "node-and-npm",
        "best-practices"
      ]
    }
  ],
  "quizzes": {
    "variables": [
      {
        "question": "Which declaration can be reassigned and is limited to its block?",
        "choices": [
          "const",
          "let",
          "var only"
        ],
        "answer": 1,
        "explanation": "let is block-scoped and allows reassignment."
      }
    ],
    "data-types": [
      {
        "question": "What does typeof null return in JavaScript?",
        "choices": [
          "\"null\"",
          "\"undefined\"",
          "\"object\""
        ],
        "answer": 2,
        "explanation": "This is a historical JavaScript quirk; null is a primitive value even though typeof null is \"object\"."
      }
    ],
    "operators": [
      {
        "question": "Which operator compares both type and value without coercion?",
        "choices": [
          "==",
          "===",
          "="
        ],
        "answer": 1,
        "explanation": "Strict equality (===) compares type and value."
      }
    ],
    "conditions": [
      {
        "question": "Which block runs when every preceding if/else-if condition is false?",
        "choices": [
          "finally",
          "default",
          "else"
        ],
        "answer": 2,
        "explanation": "The else branch is the fallback branch for an if statement."
      }
    ],
    "loops": [
      {
        "question": "Which loop is guaranteed to run its body at least once?",
        "choices": [
          "for",
          "while",
          "do...while"
        ],
        "answer": 2,
        "explanation": "do...while tests its condition after the first body execution."
      }
    ],
    "functions": [
      {
        "question": "What does a function return when it has no return statement?",
        "choices": [
          "null",
          "undefined",
          "false"
        ],
        "answer": 1,
        "explanation": "JavaScript functions return undefined by default."
      }
    ],
    "arrays": [
      {
        "question": "What is the index of the first item in an array?",
        "choices": [
          "0",
          "1",
          "-1"
        ],
        "answer": 0,
        "explanation": "JavaScript arrays use zero-based indexes."
      }
    ],
    "array-methods": [
      {
        "question": "Which method creates a new array by transforming every item?",
        "choices": [
          "filter",
          "map",
          "reduce"
        ],
        "answer": 1,
        "explanation": "map returns a new array with each callback result."
      }
    ],
    "objects": [
      {
        "question": "How do you read the name property from a variable called user?",
        "choices": [
          "user->name",
          "user.name",
          "user::name"
        ],
        "answer": 1,
        "explanation": "Dot notation reads a property whose name is known."
      }
    ],
    "dom": [
      {
        "question": "Which method selects the first element matching a CSS selector?",
        "choices": [
          "document.querySelector()",
          "document.match()",
          "document.getAll()"
        ],
        "answer": 0,
        "explanation": "querySelector returns the first matching element or null."
      }
    ],
    "events": [
      {
        "question": "What is the modern way to register a click handler?",
        "choices": [
          "element.addEventListener(\"click\", handler)",
          "element.on(\"click\", handler)",
          "element.listen(\"click\", handler)"
        ],
        "answer": 0,
        "explanation": "addEventListener is the standard event subscription API."
      }
    ],
    "promises": [
      {
        "question": "Which Promise method handles a rejection?",
        "choices": [
          ".then()",
          ".catch()",
          ".finally()"
        ],
        "answer": 1,
        "explanation": "catch handles rejected Promises; finally runs after either outcome."
      }
    ],
    "async-await": [
      {
        "question": "What does an async function always return?",
        "choices": [
          "A Promise",
          "A timer",
          "A DOM element"
        ],
        "answer": 0,
        "explanation": "An async function wraps its returned value in a Promise."
      }
    ],
    "fetch": [
      {
        "question": "Does fetch reject automatically for an HTTP 404 response?",
        "choices": [
          "Yes, always",
          "No; check response.ok",
          "Only when JSON is invalid"
        ],
        "answer": 1,
        "explanation": "fetch normally resolves with a Response for HTTP error statuses; check response.ok."
      }
    ],
    "classes": [
      {
        "question": "Which keyword calls a parent class constructor?",
        "choices": [
          "parent()",
          "super()",
          "base()"
        ],
        "answer": 1,
        "explanation": "Call super() in a derived class constructor before using this."
      }
    ],
    "modules": [
      {
        "question": "What script attribute enables JavaScript modules in HTML?",
        "choices": [
          "async=\"module\"",
          "type=\"module\"",
          "module=\"true\""
        ],
        "answer": 1,
        "explanation": "Use <script type=\"module\"> to load a browser module."
      }
    ]
  },
  "exercises": {
    "variables": {
      "task": "Create a const called firstName, a let called score, add 5 to score, and log both values.",
      "starter": "const firstName = \"Your name\";\nlet score = 0;\n// Add 5 to score and log both values."
    },
    "operators": {
      "task": "Calculate the remainder when 17 is divided by 5, then log it.",
      "starter": "const remainder = 17 % 5;\nconsole.log(remainder);"
    },
    "conditions": {
      "task": "Set temperature to a number and log \"Warm\" if it is above 20; otherwise log \"Cool\".",
      "starter": "const temperature = 18;\n// Write an if/else statement."
    },
    "loops": {
      "task": "Use a loop to log each number from 1 to 5.",
      "starter": "for (let number = 1; number <= 5; number++) {\n  // Log number\n}"
    },
    "functions": {
      "task": "Write a function that accepts two numbers and returns their sum.",
      "starter": "function add(a, b) {\n  // Return the sum\n}\nconsole.log(add(2, 3));"
    },
    "arrays": {
      "task": "Add \"mango\" to the array and log the first fruit.",
      "starter": "const fruits = [\"apple\", \"banana\"];\n// Add an item and log the first one."
    },
    "array-methods": {
      "task": "Use filter to make an array containing only numbers greater than 5.",
      "starter": "const values = [2, 6, 9, 3];\nconst largeValues = values.filter(value => /* condition */);\nconsole.log(largeValues);"
    },
    "objects": {
      "task": "Create a book object with title and pages properties, then log its title.",
      "starter": "const book = {\n  title: \"A first book\",\n  pages: 100\n};\n// Log the title"
    },
    "events": {
      "task": "Create a button and add a click handler that logs a message.",
      "starter": "const button = document.createElement(\"button\");\nbutton.textContent = \"Click me\";\ndocument.body.append(button);\n// Add a click listener"
    },
    "promises": {
      "task": "Create a resolved Promise with the value \"Done\" and log its value with then().",
      "starter": "Promise.resolve(\"Done\")\n  .then(value => console.log(value));"
    },
    "async-await": {
      "task": "Write an async function that awaits Promise.resolve(10) and logs the result.",
      "starter": "async function showValue() {\n  const value = await Promise.resolve(10);\n  console.log(value);\n}\nshowValue();"
    },
    "dom": {
      "task": "Create a paragraph, set its text with textContent, and append it to the page.",
      "starter": "const paragraph = document.createElement(\"p\");\nparagraph.textContent = \"Hello from the DOM\";\ndocument.body.append(paragraph);"
    }
  },
  "projects": [
    {
      "title": "To-do list",
      "description": "Add, complete, and remove tasks. Save the task list locally in the browser.",
      "level": "Beginner",
      "lessons": [
        "dom",
        "events",
        "storage"
      ]
    },
    {
      "title": "Calculator",
      "description": "Create a calculator with buttons, event handling, and arithmetic operations.",
      "level": "Beginner",
      "lessons": [
        "dom",
        "events",
        "functions",
        "operators"
      ]
    },
    {
      "title": "Quiz app",
      "description": "Display questions, check answers, show a score, and let the learner try again.",
      "level": "Intermediate",
      "lessons": [
        "arrays",
        "objects",
        "events",
        "conditions"
      ]
    },
    {
      "title": "Weather app",
      "description": "Request public weather data, check HTTP errors, and display a friendly result.",
      "level": "Intermediate",
      "lessons": [
        "async-await",
        "fetch",
        "dom"
      ]
    },
    {
      "title": "Digital clock",
      "description": "Display the current time and update it with a timer.",
      "level": "Beginner",
      "lessons": [
        "dates",
        "web-apis",
        "dom"
      ]
    },
    {
      "title": "Form validator",
      "description": "Check form entries, show accessible feedback, and use native HTML constraints.",
      "level": "Intermediate",
      "lessons": [
        "forms",
        "events",
        "conditions"
      ]
    }
  ]
};
})();
