module.exports = {

    getRandomArrayIndex(arrayLength) {
        return Math.floor(
            Math.random() * arrayLength // No need to add 1 because we need to generate an array  index given the array length
        );
    },

    getUniqueRandomIndexesFromArray(array, itemsToChoose) {
        if (itemsToChoose >= array.length) {
            throw new Error(`cannot choose ${itemsToChoose} items given an array of ${array.length} items`);
        }

        let chosenItems = 0;
        const chosenRandomIndexes = {};

        while (chosenItems < itemsToChoose) {
            const randomIndex = this.getRandomArrayIndex(array.length);

            if (!chosenRandomIndexes[randomIndex]) {
                chosenRandomIndexes[randomIndex] = true;
                chosenItems++;
            }
        }

        return Object.keys(chosenRandomIndexes);
    }
};