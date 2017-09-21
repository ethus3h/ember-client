#!/usr/bin/env perl6

use v6.c;
use Test;

grammar EM {
    token TOP { <block> }
    token block { [<simpleBlock>\nblock]|<simpleBlock> }
    token simpleBlock { <line>*<finalLine>? }

    token line { " "*<lineContents>\n }
    token finalLine { " "*<lineContents> }
    token lineContents { <declaration>|<invocation>|[''] }

    token escapedString { [\w|[\\\N]]+ }
    token literal { <number> }
    token number { \d+ }

    token declaration { [<identifier>\=<literal>]|[<identifier>\:] }

    token type { 'String'|\* }
    token identifier { [[<type>\x20]?<identifierBody>] }
    token identifierBody { <routineIdentifier>|<identifierString> }
    token identifierString { <escapedString> }

    token routineIdentifier { <identifierString>\([[<parameterSignature>\,\x20]*<parameterSignature>]?\) }
    token parameterSignature { <type>[\x20<identifierString>]?\?? }

    token invocation { <identifierString>\([<parameter>\x20]*<parameter>\) }
    token parameter { <identifierString>|<declaration> }
}

sub runParserTest(Str $code, Str :$rule) {
    if ! EM.parse($code, :$rule) {
        {
            use Grammar::Tracer;
            say EM.parse($code, :$rule);
            fail "Parsing failed.";
        }
    }
    else {
        return True;
    }
}

ok runParserTest("foo(String, String qux?, *)", :rule<identifier>);
ok runParserTest("foo(String, String qux?, *)", :rule<routineIdentifier>);
ok runParserTest("foo(bar baz)", :rule<invocation>);
ok runParserTest("foo(bar 6 qux)", :rule<invocation>);
ok runParserTest("foo(qux=6 bar)", :rule<invocation>);
ok runParserTest("foo bar baz", :rule<invocation>);
ok runParserTest("foo bar 6 qux", :rule<invocation>);
ok runParserTest("foo qux=6 bar", :rule<invocation>);
done-testing
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
