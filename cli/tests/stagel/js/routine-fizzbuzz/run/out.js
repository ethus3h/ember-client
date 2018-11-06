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
    /* Or it could be written using brackets like this. Also the "test" and "do" commands are optional since if knows what it's about. */
    await if(declare -a arr=()
)
    await eq(declare -a arr=([0]="literal-n" [1]="")
)
    await mod(declare -a arr=([0]="ident-n" [1]="num" [2]="literal-n" [3]=$'\005')
)
        /* This isn't very fun to read, though. */
        /* Or, the brackets can be omitted since the number of things needed can be used to infer. The / between type and identifier maybe can also be omitted (have types be reserved words). */

        strReturn = 'Buzz'; await assertIsStr(strReturn); return strReturn;
    await if(declare -a arr=()
)
    await eq(declare -a arr=([0]="literal-n" [1]="")
)
    await mod(declare -a arr=([0]="ident-n" [1]="num" [2]="literal-n" [3]=$'\003')
)
        /* Even less fun to read. */

        strReturn = 'Fizz'; await assertIsStr(strReturn); return strReturn;
/* A string is an array of 8-bit bytes. */
async function fizzBuzz() {
    let strReturn;

    await output-assert(declare -a arr=()
)
    /* the output should be non-empty. Unless otherwise specified, would take and yield nothing. */
    await -n(declare -a arr=()
)
    await new(declare -a arr=([0]="ident-n" [1]="counter" [2]="literal-n" [3]=$'\001')
)
    await until(declare -a arr=()
)
        await test(declare -a arr=()
)
            await eq(declare -a arr=([0]="ident-n" [1]="counter" [2]="literal-n" [3]="d")
)
        await do(declare -a arr=()
)
            /* out is like return, but doesn't exit and more data can continue to be output */
            await out(declare -a arr=()
)
                await run(declare -a arr=()
)
                await fbSwitcher(declare -a arr=([0]="ident-n" [1]="counter")
)
