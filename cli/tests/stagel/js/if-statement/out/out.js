if (await implEq(0, await implMod(intNum, 15))) {

    strReturn = 'FizzBuzz'; await assertIsStr(strReturn); return strReturn;
}
