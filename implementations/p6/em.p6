#!/usr/bin/env perl6

use v6.c;
use Grammar::Tracer;
use Test;

grammar EM {
    token TOP { <block> }
    token block { [<simpleBlock>\nblock]|<simpleBlock> }
    token simpleBlock { <line>*<finalLine>? }
    token line { " "*<lineContents>\n }
    token finalLine { " "*<lineContents> }
    token lineContents { <declaration>|<invocation>|[''] }
    token declaration { [<identifier>\=<literal>]|[<identifier>\:] }
    token identifier { [[<type>\x20]?<identifierBody>] }
    token type { 'String'|\* }
    token identifierBody { <routineIdentifier>|<identifierString> }
    token routineIdentifier { <identifierString>\([[<parameterSignature>\,\x20]*<parameterSignature>]?\) }
    token identifierString { <escapedString> }
    token escapedString { [\w|[\\\N]]+ }
    token parameterSignature { <type>[\x20<identifierString>]?\?? }
    token invocation { <identifierString>\([<parameter>\x20]*<parameter>\) }
    token parameter { <identifierString>|<declaration> }
    token literal { <number> }
    token number { \d+ }
}

ok EM.parse("foo(String, String qux?, *)", :rule<identifier>);
ok EM.parse("foo(String, String qux?, *)", :rule<routineIdentifier>);

# my $m = EM.parse(Q[String foo(String, String qux?, *):
# foo(bar baz)
# foo(qux=6 bar)]);
# my $n = Q[    say $!par[1]$!par[2]$qux
# 
# # Test simple invocation
# foo(bar baz)
# foo(bar 6 qux) # qux is 6, param 0 is bar, param 1 is 6, and param 2 is qux
# foo(qux=6 bar) # qux is still 6, but now parameter 0 is 6 and 1 is bar
# 
# # Test simple invocation, parenthesis-less style
# foo bar baz
# foo bar 6 qux # qux is 6, param 0 is bar, param 1 is 6, and param 2 is qux
# foo qux=6 bar # qux is still 6, but now parameter 0 is 6 and 1 is bar
# 
# # Test invocation with "invoke"
# routineName="foo"
# invoke $routineName bar baz
# ];
# say $m;
