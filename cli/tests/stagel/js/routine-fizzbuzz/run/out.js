async function fbSwitcher(intNum) {
    await assertIsInt(intNum); let strReturn;

    await if(declare -a arr=()
)
    await eq(declare -a arr=([0]="literal-n" [1]="")
)
    await mod(declare -a arr=([0]="ident-n" [1]="num" [2]="literal-n" [3]=$'\017')
)
        /* just a literal sequence of bytes. Everything should be binary safe. 0x could be used to return data, too. 0x = data, not numbers, in StageL. */

        strReturn = 'FizzBuzz'; await assertIsStr(strReturn); return strReturn;
    /* Comment */
    await if(declare -a arr=()
)
    await eq(declare -a arr=([0]="literal-n" [1]="")
)
    await mod(declare -a arr=([0]="ident-n" [1]="num" [2]="literal-n" [3]=$'\005')
)
        /* Comment 2 */
        /* Comment 3 */

        strReturn = 'Buzz'; await assertIsStr(strReturn); return strReturn;
    /* Could also write it like this, with the condition on another line */
    await if(declare -a arr=()
)
        await eq(declare -a arr=([0]="literal-n" [1]="")
)
        await mod(declare -a arr=([0]="ident-n" [1]="num" [2]="literal-n" [3]=$'\003')
)
        /* Comment 4 */

        strReturn = 'Fizz'; await assertIsStr(strReturn); return strReturn;
}
/* A string is an array of 8-bit bytes. */
    await return-assert(declare -a arr=()
)
    /* the output should be non-empty. */
    await -n(declare -a arr=()
)
    await new(declare -a arr=([0]="ident-n" [1]="counter" [2]="literal-n" [3]=$'\001')
)
    await until(declare -a arr=()
)
        await eq(declare -a arr=([0]="ident-n" [1]="counter" [2]="literal-n" [3]="d")
)
        await set(declare -a arr=([0]="ident-n" [1]="counter")
)
        await add(declare -a arr=([0]="ident-n" [1]="counter" [2]="literal-n" [3]=$'\001')
)

        rootReturn = ; await assertIsRoot(rootReturn); return rootReturn;
