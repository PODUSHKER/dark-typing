// This is where you would add your text files
// For this demo, we'll use some sample texts in different languages

const textDatabase = {
    en: [
        "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",
        "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
        "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
        "The universe is under no obligation to make sense to you. Science is a way of trying not to fool yourself.",
        "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems."
    ],
    ru: [
        "Съешь ещё этих мягких французских булок, да выпей чаю. Эта фраза содержит все буквы русского алфавита.",
        "Программирование - это процесс создания компьютерных программ с помощью языков программирования.",
        "Быть или не быть, вот в чем вопрос. Достойно ль смиряться под ударами судьбы, иль надо оказать сопротивленье.",
        "Вселенная не обязана быть понятной для вас. Наука - это способ попытаться не обманывать себя.",
        "Искусственный интеллект - это свойство интеллектуальных систем выполнять творческие функции."
    ],
    code: [
        "function calculateSum(a, b) { return a + b; } // This function adds two numbers",
        "const array = [1, 2, 3]; array.map(item => item * 2); // Doubles each item",
        "class User { constructor(name) { this.name = name; } } // Simple class definition",
        "if (x > 10) { ; } // Conditional",
        "for (let i = 0; i < 10; i++) { ; } // Basic loop example"
    ]
};

// To add your own text files:
// 1. Create separate files like en.txt, ru.txt, etc.
// 2. Load them via fetch or include them in this file
// 3. Format as arrays of strings like above