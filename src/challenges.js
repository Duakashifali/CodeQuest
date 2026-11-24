// Challenge Packs: small coding drills grouped by language. All text is original.
const Q = '[\\x22\\x27]'; // matches " or '
const LANG = {
  Python: { file: 'script.py', start: '# Write code below\n', col: '#3b82c4' }, JavaScript: { file: 'script.js', start: '// Write code below\n', col: '#f7c600' },
  HTML: { file: 'index.html', start: '<!-- Write code below -->\n', col: '#e44d26' }, Java: { file: 'Main.java', start: '// Write code below\n', col: '#e76f00' },
  'C#': { file: 'Program.cs', start: '// Write code below\n', col: '#9b4f96' },
};
export const THEME = {
  blue: { border: '#0a6bb8', c1: '#0a3f8f', c2: '#12b0ff', shadow: '#0a2a66' }, orange: { border: '#e24a26', c1: '#8a1500', c2: '#ff7a1f', shadow: '#7a1a00' },
  purple: { border: '#6b2bd9', c1: '#3510c4', c2: '#9b6bff', shadow: '#2a0a8a' }, amber: { border: '#e56f00', c1: '#8a3a00', c2: '#ffb020', shadow: '#7a3000' },
  magenta: { border: '#6a1f7e', c1: '#7a0f6f', c2: '#e268d8', shadow: '#4a0a52' }, soon: { border: '#18233a', c1: '#0a1424', c2: '#4b5b78', shadow: '#05070f' },
};
export const LANGS = ['All', 'Python', 'JavaScript', 'HTML', 'Java', 'C#'];
export const LANGCOL = Object.fromEntries(Object.entries(LANG).map(([k, v]) => [k, v.col]));
const it = (e, title, xp, lvl, instr, hint, check, out = '') => ({ e, title, xp, lvl, instr, hint, check, out });
const pk = (id, lang, name, th, icon, desc, run, items, club) => ({ id, lang, name, th, icon, desc, run, club: !!club, items, ...LANG[lang] });
export const stats = (p) => ({ n: p.items.length, xp: p.items.reduce((a, c) => a + c.xp, 0), mins: p.items.length * 6 });

export const PACKS = [
  pk('py-vars', 'Python', 'Variables', 'blue', 'gem', 'Practice variables in Python.', 'py', [
    it('🐍', 'Hello Variables', 5, 'EASY', 'Create a variable called `greeting` that holds the text `Hello, Python!` and print it with `print()`.', 'greeting = "Hello, Python!"\nprint(greeting)',
      [['greeting[ ]*=[ ]*' + Q + '.+' + Q, 'Create greeting with a text value'], ['print[(][ ]*greeting[ ]*[)]', 'Print greeting']], 'Hello, Python!'),
    it('🏷️', 'Name Tag', 5, 'EASY', 'Make `name` (text) and `age` (a number), then print them together with an f-string, for example `Sam is 12`.', 'name = "Sam"\nage = 12\nprint(f"{name} is {age}")',
      [['name[ ]*=[ ]*' + Q, 'Create name'], ['age[ ]*=[ ]*[0-9]+', 'Create age'], ['print[(][ ]*f' + Q + '.*[{]name[}].*[{]age[}]', 'Print an f-string with {name} and {age}']], 'Sam is 12'),
    it('🚀', 'Level Up', 5, 'EASY', 'Start with `score = 10`. Then add 5 by writing `score = score + 5` and print `score`.', 'score = 10\nscore = score + 5\nprint(score)',
      [['score[ ]*=[ ]*10', 'Start score at 10'], ['score[ ]*=[ ]*score[ ]*[+]', 'Add to score'], ['print[(][ ]*score', 'Print score']], '15'),
    it('🔢', 'Even or Odd', 5, 'MEDIUM', 'The modulo operator `%` gives the remainder. Set `number = 7` and print `number % 2`. A result of 1 means the number is odd.', 'number = 7\nprint(number % 2)',
      [['number[ ]*=[ ]*[0-9]+', 'Create number'], ['[%][ ]*2', 'Use % 2'], ['print', 'Print the result']], '1'),
    it('🐶', 'Pet Age', 10, 'MEDIUM', 'A dog year counts as 7 human years. Make `dog_age = 3`, calculate `human_age` as `dog_age * 7`, then print `human_age`.', 'dog_age = 3\nhuman_age = dog_age * 7\nprint(human_age)',
      [['dog_age[ ]*=[ ]*[0-9]+', 'Create dog_age'], ['human_age[ ]*=[ ]*dog_age[ ]*[*][ ]*7', 'Calculate human_age'], ['print[(][ ]*human_age', 'Print human_age']], '21'),
  ]),
  pk('py-flow', 'Python', 'Control Flow', 'blue', 'shield', 'Practice if, elif and else in Python.', 'check', [
    it('➕', 'Positive or Not', 5, 'EASY', 'Set `number = -3`. Use `if` and `else` to print `Positive` when it is above 0, otherwise print `Not positive`.', 'number = -3\nif number > 0:\n    print("Positive")\nelse:\n    print("Not positive")',
      [['if[ ]+.+:', 'Write an if with a colon'], ['else[ ]*:', 'Add an else branch'], ['print', 'Print a message']], 'Not positive'),
    it('🎓', 'Grade Bands', 5, 'MEDIUM', 'With `score = 85`, use `if`, `elif` and `else` to print `A` for 90 or more, `B` for 80 or more, otherwise `C`.', 'score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")',
      [['if[ ]+.+:', 'Write an if'], ['elif[ ]+.+:', 'Add an elif'], ['else[ ]*:', 'Add an else']], 'B'),
    it('🎟️', 'Ticket Check', 5, 'MEDIUM', 'A person may enter if `age >= 12` `and` `has_ticket` is True. Print `Allowed` when both are true.', 'age = 14\nhas_ticket = True\nif age >= 12 and has_ticket:\n    print("Allowed")',
      [['if[ ]+.*[ ]and[ ]', 'Use and inside an if'], ['print', 'Print the result']], 'Allowed'),
    it('☔', 'Weather Chooser', 10, 'MEDIUM', 'Set `weather = "rain"`. If it equals `"rain"` print `Take an umbrella`, otherwise print `Enjoy the sun`.', 'weather = "rain"\nif weather == "rain":\n    print("Take an umbrella")\nelse:\n    print("Enjoy the sun")',
      [['==', 'Compare with =='], ['else[ ]*:', 'Add an else'], ['print', 'Print a message']], 'Take an umbrella'),
  ]),
  pk('py-loops', 'Python', 'Loops', 'blue', 'coin', 'Practice for and while loops in Python.', 'check', [
    it('🔁', 'Count to 5', 5, 'EASY', 'Use a `for` loop with `range(1, 6)` to print the numbers 1 to 5.', 'for i in range(1, 6):\n    print(i)',
      [['for[ ]+[a-z_]+[ ]+in[ ]+range', 'Write for ... in range(...)'], ['print', 'Print inside the loop']], '1\n2\n3\n4\n5'),
    it('➕', 'Sum to 10', 5, 'MEDIUM', 'Start `total = 0`, add every number from 1 to 10 inside a loop, then print `total`.', 'total = 0\nfor i in range(1, 11):\n    total += i\nprint(total)',
      [['total[ ]*=[ ]*0', 'Start total at 0'], ['for[ ]+', 'Use a for loop'], ['total[ ]*([+]=|=[ ]*total[ ]*[+])', 'Add to total'], ['print[(][ ]*total', 'Print total']], '55'),
    it('⏳', 'Countdown', 5, 'MEDIUM', 'Use a `while` loop to count down from 3 to 1, printing each number.', 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1',
      [['while[ ]+.+:', 'Write a while loop'], ['print', 'Print each number'], ['-=|[-][ ]*1', 'Count down']], '3\n2\n1'),
    it('🛑', 'Stop at 3', 10, 'MEDIUM', 'Loop through `range(1, 10)` but use `break` to stop after printing 3.', 'for i in range(1, 10):\n    print(i)\n    if i == 3:\n        break',
      [['for|while', 'Use a loop'], ['break', 'Use break'], ['if', 'Use an if to decide when to stop']], '1\n2\n3'),
  ]),
  pk('py-funcs', 'Python', 'Functions', 'blue', 'puzzle', 'Practice writing functions in Python.', 'check', [
    it('👋', 'Greeter', 5, 'EASY', 'Define `greet(name)` that returns `Hello, ` plus the name, then print `greet("Sam")`.', 'def greet(name):\n    return "Hello, " + name + "!"\nprint(greet("Sam"))',
      [['def[ ]+greet[(]', 'Define greet'], ['return', 'Return a value'], ['print[(][ ]*greet[(]', 'Print greet(...)']], 'Hello, Sam!'),
    it('➕', 'Add Two', 5, 'MEDIUM', 'Define `add(a, b)` that returns the sum, then print `add(3, 4)`.', 'def add(a, b):\n    return a + b\nprint(add(3, 4))',
      [['def[ ]+add[(][a-z_]+,[ ]*[a-z_]+[)]', 'Define add with two parameters'], ['return', 'Return the sum'], ['print[(][ ]*add[(]', 'Print add(3, 4)']], '7'),
    it('🔎', 'Is Even', 10, 'MEDIUM', 'Define `is_even(n)` that returns `True` when `n % 2 == 0`. Print `is_even(10)`.', 'def is_even(n):\n    return n % 2 == 0\nprint(is_even(10))',
      [['def[ ]+is_even', 'Define is_even'], ['[%][ ]*2', 'Use % 2'], ['==', 'Compare with ==']], 'True'),
  ], true),
  pk('py-lists', 'Python', 'Lists', 'blue', 'chip', 'Practice working with lists in Python.', 'check', [
    it('🍎', 'Fruit List', 5, 'EASY', 'Make a list called `fruits` with three fruit names and print it.', 'fruits = ["apple", "banana", "mango"]\nprint(fruits)',
      [['fruits[ ]*=[ ]*[[]', 'Create the fruits list'], ['print[(][ ]*fruits', 'Print the list']], "['apple', 'banana', 'mango']"),
    it('➕', 'Add Item', 5, 'MEDIUM', 'Add `"kiwi"` to the end of `fruits` with `append()` and print the list.', 'fruits = ["apple", "banana", "mango"]\nfruits.append("kiwi")\nprint(fruits)',
      [['append[ ]*[(]', 'Use append'], ['print', 'Print the list']], "['apple', 'banana', 'mango', 'kiwi']"),
    it('🔁', 'Loop the List', 10, 'MEDIUM', 'Use a `for` loop to print every fruit on its own line.', 'for item in fruits:\n    print(item)',
      [['for[ ]+[a-z_]+[ ]+in[ ]+[a-z_]+[ ]*:', 'Loop with for ... in ...'], ['print', 'Print each item']], 'apple\nbanana\nmango'),
  ], true),
  pk('html-el', 'HTML', 'Elements', 'orange', 'cube', 'Practice basic HTML elements.', 'web', [
    it('🔠', 'Main Title', 5, 'EASY', 'Add an `<h1>` heading with the text of your choice.', '<h1>My Page</h1>', [['<h1[^>]*>[^<]+</h1>', 'Add an <h1> with text']]),
    it('📝', 'A Paragraph', 5, 'EASY', 'Add a `<p>` paragraph that says something about you.', '<p>I love building apps.</p>', [['<p[^>]*>[^<]+</p>', 'Add a <p> with text']]),
    it('🔗', 'Make a Link', 5, 'MEDIUM', 'Add an `<a>` link with an `href` that points to `https://example.com`.', '<a href="https://example.com">Visit</a>', [['<a[ ]+[^>]*href=', 'Add an <a> with href'], ['>[^<]+</a>', 'Give the link some text']]),
    it('🖼️', 'Show a Picture', 10, 'MEDIUM', 'Add an `<img>` with a `src` and an `alt` description.', '<img src="cat.png" alt="A cat">', [['<img[^>]+src=', 'Add src'], ['<img[^>]+alt=', 'Add alt text']]),
  ]),
  pk('html-struct', 'HTML', 'Structure', 'orange', 'doc', 'Practice structuring an HTML page.', 'web', [
    it('🧱', 'Head and Body', 5, 'EASY', 'Build a page with a `<head>` containing a `<title>`, and a `<body>` with a heading.', '<head><title>Hi</title></head>\n<body><h1>Hello</h1></body>', [['<head[\\s\\S]*<title', 'Add a <title> in <head>'], ['<body[\\s\\S]*<h1', 'Add an <h1> in <body>']]),
    it('🏗️', 'Header, Main, Footer', 5, 'MEDIUM', 'Use `<header>`, `<main>` and `<footer>` to organise a page.', '<header>Top</header>\n<main>Middle</main>\n<footer>End</footer>', [['<header', 'Add <header>'], ['<main', 'Add <main>'], ['<footer', 'Add <footer>']]),
    it('📋', 'A Bulleted List', 10, 'MEDIUM', 'Make a `<ul>` with three `<li>` items.', '<ul>\n  <li>One</li>\n  <li>Two</li>\n  <li>Three</li>\n</ul>', [['<ul[\\s\\S]*<li[\\s\\S]*<li[\\s\\S]*<li', 'Add a <ul> with three <li>']]),
  ]),
  pk('js-cond', 'JavaScript', 'Conditionals', 'purple', 'shield', 'Practice if statements in JavaScript.', 'js', [
    it('🌡️', 'If Statement', 5, 'EASY', 'Set `let temperature = 30;` and log `Hot` with `console.log` when it is above 25.', 'let temperature = 30;\nif (temperature > 25) {\n  console.log("Hot");\n}', [['if[ ]*[(]', 'Write an if'], ['console[.]log', 'Log a message']]),
    it('🔀', 'If Else', 5, 'EASY', 'Log `Adult` if `age >= 18`, otherwise log `Minor`.', 'let age = 15;\nif (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}', [['if[ ]*[(]', 'Write an if'], ['else', 'Add an else'], ['console[.]log', 'Log a message']]),
    it('🎓', 'Else If', 5, 'MEDIUM', 'Use `else if` to log `A`, `B` or `C` for a `score`.', 'let score = 85;\nif (score >= 90) { console.log("A"); }\nelse if (score >= 80) { console.log("B"); }\nelse { console.log("C"); }', [['else[ ]+if', 'Use else if'], ['console[.]log', 'Log a result']]),
    it('❓', 'Ternary', 10, 'MEDIUM', 'Use the ternary operator `? :` to log `Even` or `Odd` for `number`.', 'let number = 4;\nconsole.log(number % 2 === 0 ? "Even" : "Odd");', [['[?][^:]*:', 'Use ? :'], ['console[.]log', 'Log the result']]),
  ]),
  pk('js-loops', 'JavaScript', 'Loops', 'purple', 'coin', 'Practice loops in JavaScript.', 'js', [
    it('🔁', 'Count to 5', 5, 'EASY', 'Use a `for` loop to log the numbers 1 to 5.', 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}', [['for[ ]*[(]', 'Write a for loop'], ['console[.]log', 'Log inside the loop']]),
    it('⏳', 'While Countdown', 5, 'MEDIUM', 'Use a `while` loop to count from 3 down to 1.', 'let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--;\n}', [['while[ ]*[(]', 'Write a while loop'], ['console[.]log', 'Log each number']]),
    it('📦', 'Loop an Array', 5, 'MEDIUM', 'Log every item of `["a", "b", "c"]` using `for...of` or `forEach`.', 'const items = ["a", "b", "c"];\nfor (const x of items) {\n  console.log(x);\n}', [['for[ ]*[(][ ]*(const|let)[ ]+[a-z]+[ ]+of|forEach', 'Use for...of or forEach'], ['console[.]log', 'Log each item']]),
    it('➕', 'Sum Numbers', 10, 'MEDIUM', 'Add the numbers 1 to 10 in a loop and log the total (55).', 'let total = 0;\nfor (let i = 1; i <= 10; i++) {\n  total += i;\n}\nconsole.log(total);', [['total[ ]*([+]=|=[ ]*total[ ]*[+])', 'Add to total'], ['for|while', 'Use a loop'], ['console[.]log', 'Log the total']]),
  ]),
  pk('java-flow', 'Java', 'Control Flow', 'amber', 'shield', 'Practice if and switch in Java.', 'check', [
    it('🌡️', 'If Statement', 5, 'EASY', 'Declare `int temperature = 30;` and print `Hot` with `System.out.println` when it is above 25.', 'int temperature = 30;\nif (temperature > 25) {\n    System.out.println("Hot");\n}', [['if[ ]*[(]', 'Write an if'], ['System[.]out[.]println', 'Use System.out.println']], 'Hot'),
    it('🎓', 'Else If', 5, 'MEDIUM', 'Use `if`, `else if` and `else` to print a grade for `int score = 85;`.', 'int score = 85;\nif (score >= 90) {\n    System.out.println("A");\n} else if (score >= 80) {\n    System.out.println("B");\n} else {\n    System.out.println("C");\n}', [['else[ ]+if', 'Use else if'], ['System[.]out[.]println', 'Print the grade']], 'B'),
    it('🔀', 'Switch', 10, 'MEDIUM', 'Use a `switch` on `int day = 2;` and print `Tuesday` for case 2.', 'int day = 2;\nswitch (day) {\n    case 1: System.out.println("Monday"); break;\n    case 2: System.out.println("Tuesday"); break;\n}', [['switch[ ]*[(]', 'Write a switch'], ['case[ ]+2', 'Add case 2'], ['break', 'Use break']], 'Tuesday'),
  ]),
  pk('java-loops', 'Java', 'Loops', 'amber', 'coin', 'Practice loops in Java.', 'check', [
    it('🔁', 'For Loop', 5, 'EASY', 'Use a `for` loop to print 1 to 5.', 'for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}', [['for[ ]*[(][ ]*int', 'Write a for loop with int i'], ['System[.]out[.]println', 'Print inside the loop']], '1\n2\n3\n4\n5'),
    it('⏳', 'While Loop', 5, 'MEDIUM', 'Use a `while` loop to count down from 3.', 'int n = 3;\nwhile (n > 0) {\n    System.out.println(n);\n    n--;\n}', [['while[ ]*[(]', 'Write a while loop'], ['n--|n[ ]*-=|n[ ]*=[ ]*n[ ]*-', 'Decrease n']], '3\n2\n1'),
    it('📦', 'Enhanced For', 10, 'MEDIUM', 'Loop through `int[] nums = {1, 2, 3};` with `for (int x : nums)`.', 'int[] nums = {1, 2, 3};\nfor (int x : nums) {\n    System.out.println(x);\n}', [['int[[]][ ]+[a-z]+', 'Declare an int array'], ['for[ ]*[(][ ]*int[ ]+[a-z]+[ ]*:', 'Use the enhanced for loop']], '1\n2\n3'),
  ]),
  pk('java-arrays', 'Java', 'Arrays', 'amber', 'chip', 'Practice arrays in Java.', 'check', [
    it('📦', 'Declare an Array', 5, 'EASY', 'Declare `int[] nums = {4, 8, 15};`.', 'int[] nums = {4, 8, 15};', [['int[[]][ ]+[a-z]+[ ]*=[ ]*[{]', 'Declare and fill an int array']], 'Array created'),
    it('🔢', 'Read an Item', 5, 'MEDIUM', 'Print the first item using `nums[0]`.', 'System.out.println(nums[0]);', [['nums[[]0]', 'Use nums[0]'], ['System[.]out[.]println', 'Print it']], '4'),
    it('📏', 'Array Length', 10, 'MEDIUM', 'Print how many items there are with `nums.length`.', 'System.out.println(nums.length);', [['nums[.]length', 'Use nums.length'], ['System[.]out[.]println', 'Print it']], '3'),
  ], true),
  pk('cs-flow', 'C#', 'Control Flow', 'magenta', 'shield', 'Practice if and switch in C#.', 'check', [
    it('🌡️', 'If Statement', 5, 'EASY', 'Declare `int temperature = 30;` and print `Hot` with `Console.WriteLine` when above 25.', 'int temperature = 30;\nif (temperature > 25)\n{\n    Console.WriteLine("Hot");\n}', [['if[ ]*[(]', 'Write an if'], ['Console[.]WriteLine', 'Use Console.WriteLine']], 'Hot'),
    it('🎓', 'Else If', 5, 'MEDIUM', 'Use `if`, `else if` and `else` to print a grade for `int score = 85;`.', 'int score = 85;\nif (score >= 90) Console.WriteLine("A");\nelse if (score >= 80) Console.WriteLine("B");\nelse Console.WriteLine("C");', [['else[ ]+if', 'Use else if'], ['Console[.]WriteLine', 'Print the grade']], 'B'),
    it('🔀', 'Switch', 10, 'MEDIUM', 'Use a `switch` on `int day = 2;` and print `Tuesday` for case 2.', 'int day = 2;\nswitch (day)\n{\n    case 2: Console.WriteLine("Tuesday"); break;\n}', [['switch[ ]*[(]', 'Write a switch'], ['case[ ]+2', 'Add case 2'], ['break', 'Use break']], 'Tuesday'),
  ]),
  { id: 'soon1', soon: true, lang: 'Coming soon', name: 'Coming soon', th: 'soon', icon: 'q', items: [] },
  { id: 'soon2', soon: true, lang: 'Coming soon', name: 'Coming soon', th: 'soon', icon: 'q', items: [] },
];
