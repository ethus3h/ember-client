    await if(declare -a arr=([0]="ident-n" [1]="num")
)
    await eq(declare -a arr=([0]="literal-n" [1]="")
)
        /* just a literal sequence of bytes. Everything should be binary safe. 0x could be used to return data, too. 0x = data, not numbers, in StageL. */
    /* Or it could be written using brackets like this. Also the "test" and "do" commands are optional since if knows what it's about. */
    await if(declare -a arr=([0]="ident-n" [1]="num" [2]="literal-n" [3]=$'\017' [4]="literal-s" [5]="FizzBuzz")
)
    await eq(declare -a arr=([0]="literal-n" [1]="")
)
        /* This isn't very fun to read, though. */
        /* Or, the brackets can be omitted since the number of things needed can be used to infer. The / between type and identifier maybe can also be omitted (have types be reserved words). */
    await if(declare -a arr=([0]="ident-n" [1]="num" [2]="literal-n" [3]=$'\005' [4]="literal-s" [5]="Buzz")
)
    await eq(declare -a arr=([0]="literal-n" [1]="")
)
        /* Even less fun to read. */
/* A string is an array of 8-bit bytes. */
    await output-assert(declare -a arr=([0]="ident-n" [1]="num" [2]="literal-n" [3]=$'\003' [4]="literal-s" [5]="Fizz" [6]="ident-r-s" [7]="fizzBuzz")
)
    /* the output should be non-empty. Unless otherwise specified, would take and yield nothing. */
    await -n(declare -a arr=()
)
    await new(declare -a arr=([0]="ident-n" [1]="counter" [2]="literal-n" [3]=$'\001')
)
            /* out is like return, but doesn't exit and more data can continue to be output */
                await run(declare -a arr=([0]="ident-n" [1]="counter" [2]="literal-n" [3]="d")
)
await fbSwitcher(declare -a arr=([0]="ident-n" [1]="counter")
)
