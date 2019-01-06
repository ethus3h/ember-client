/* arrays, provides:
    append
*/

async function append(array1, array2) {
    await assertIsArray(array1); await assertIsArray(array2); let arrayReturn;
/*FIXME*/
    arrayReturn=array1.push(array2); await assertIsArray(arrayReturn); return arrayReturn;
}
