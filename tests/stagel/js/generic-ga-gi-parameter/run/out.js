async function ne(genericArrayA, genericItemB) {
    await internalDebugCollect('genericArray A = ' + genericArrayA + '; '); await internalDebugCollect('genericItem B = ' + genericItemB + '; '); await internalDebugStackEnter('ne:in'); await assertIsGenericArray(genericArrayA); await assertIsGenericItem(genericItemB); let boolReturn;

    let boolTemp = false;
