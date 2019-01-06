/* arrays, provides:
    append
*/

async function append(array1, array2) {
    await assertIsArray(array1); await assertIsArray(array2); let arrayReturn;

    arrayReturn=array1.concat(array2); await assertIsArray(arrayReturn); return arrayReturn;
}
