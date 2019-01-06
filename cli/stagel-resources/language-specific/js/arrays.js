/* arrays, provides:
    append
*/

async function append(array1, array2) {
    await assertIsArray(array1); await assertIsArray(array2); let arrayReturn;

    console.log("bourcbec", array2); arrayReturn=array1.concat(array2); await assertIsArray(arrayReturn); return arrayReturn;
}
