/* arrays, provides:
    append
*/

async function append(array1, array2) {
    await assertIsArray(array1); await assertIsArray(array2); let arrayReturn;

    arrayReturn=array1.concat(array2); await assertIsArray(arrayReturn); return arrayReturn;
}

async function get(array, index) {
    await assertIsArray(array); await assertIsInt(index); let returnVal;

    returnVal=array[index]; await assertIsGeneric(returnVal); return returnVal;
}
