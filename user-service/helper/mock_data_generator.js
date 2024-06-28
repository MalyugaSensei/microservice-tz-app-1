const getRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const generateUser = () => {
    const firstNames = [
        "Александр", "Максим", "Иван", "Артем", "Дмитрий",
        "Николай", "Сергей", "Павел", "Владимир", "Михаил"
    ];

    const lastNames = [
        "Иванов", "Петров", "Сидоров", "Кузнецов", "Смирнов",
        "Попов", "Васильев", "Михайлов", "Новиков", "Федоров"
    ];

    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);

    return {
        firstName,
        lastName,
        age: Math.floor(Math.random() * 100),
        gender: getRandomElement(["male", "female", "any"]),
        problems: getRandomElement([true, false]),
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
}

module.exports = {
    generateUser
}