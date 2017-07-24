grammar EM {
    token TOP { <line>+<finalLine> }
    token line { <lineContents>\n }
    token finalLine { <line>|<bareFinalLine> }
    token bareFinalLine { <lineContents> }
    token lineContents { <declaration>|\N* }
    token declaration { (<identifier>\=<literal>)|(<identifier>:) }
    token identifier { (<type>\x20)?<identifierBody> }
    
}
 
my $m = EM.parse(Q[String foo(String, String qux?, *):
    say $!par[1]$!par[2]$qux

# Test simple invocation
foo(bar baz)
foo(bar 6 qux) # qux is 6, param 0 is bar, param 1 is 6, and param 2 is qux
foo(qux=6 bar) # qux is still 6, but now parameter 0 is 6 and 1 is bar

# Test simple invocation, parenthesis-less style
foo bar baz
foo bar 6 qux # qux is 6, param 0 is bar, param 1 is 6, and param 2 is qux
foo qux=6 bar # qux is still 6, but now parameter 0 is 6 and 1 is bar

# Test invocation with "invoke"
routineName="foo"
invoke $routineName bar baz
]);
say $m;
