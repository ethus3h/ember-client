#!/usr/bin/env perl6

use v6.c;
use Test;
use Grammar::Tracer;
use Grammar::ErrorReporting;

use lib '.';
use EM;
use SymbolTable;
use TestHelper;

my TestHelper $th = new TestHelper();

say 'Testing optionalParameter';
(
    ok $th.runParserTest('String qux?', 'optionalParameter');
);

say 'Testing parameter';
(
    ok $th.runParserTest('*', 'parameter');
    ok $th.runParserTest('String qux?', 'parameter');
    nok $th.runParserTest('String qux?,', 'parameter', True);
);

say 'Testing parameterListBody';
(
    ok $th.runParserTest('', 'parameterListBody');
    ok $th.runParserTest('*', 'parameterListBody');
    ok $th.runParserTest('String qux, *', 'parameterListBody');
    ok $th.runParserTest('String qux?, *', 'parameterListBody');
    ok $th.runParserTest('String qux?', 'parameterListBody');
    ok $th.runParserTest('String, *', 'parameterListBody');
    ok $th.runParserTest('String, String qux, String', 'parameterListBody');
    ok $th.runParserTest('String, String qux?, *', 'parameterListBody');
    ok $th.runParserTest('String, String qux?, String', 'parameterListBody');
    ok $th.runParserTest('String, String qux?', 'parameterListBody');
    ok $th.runParserTest('String, String qux', 'parameterListBody');
    ok $th.runParserTest('String?, *', 'parameterListBody');
);

say 'Testing parenthesizedParameterList';
(
    ok $th.runParserTest('(String, String qux?)', 'parenthesizedParameterList');
);

say 'Testing parameterList';
(
    ok $th.runParserTest('()', 'parameterList');
    ok $th.runParserTest('(*)', 'parameterList');
    ok $th.runParserTest('(String, *)', 'parameterList');
    ok $th.runParserTest('(String, String qux?, *)', 'parameterList');
    ok $th.runParserTest('(String, String qux?)', 'parameterList');
    ok $th.runParserTest('(String, String qux)', 'parameterList');
    #FIXME #ok $th.runParserTest('$1$2$qux', 'parameterList');
);

say 'Testing identifier';
(
    ok $th.runParserTest('foo', 'identifier');
    ok $th.runParserTest('foo(String, String qux?, *)', 'identifier');
    ok $th.runParserTest('foo(String, String qux?)', 'identifier');
    ok $th.runParserTest('String foo(String, String qux?, *)', 'identifier');
);

say 'Testing invocation';
(
    ok $th.runParserTest('foo (bar, baz)', 'invocation');
    ok $th.runParserTest('foo bar 6 qux', 'invocation');
    ok $th.runParserTest('foo bar baz', 'invocation');
    ok $th.runParserTest('foo bar', 'invocation');
    ok $th.runParserTest('foo qux=6 bar', 'invocation');
    ok $th.runParserTest('foo(bar 6 qux)', 'invocation');
    ok $th.runParserTest('foo(bar baz)', 'invocation');
    ok $th.runParserTest('foo(bar, baz)', 'invocation');
    ok $th.runParserTest('foo(bar)', 'invocation');
    ok $th.runParserTest('foo(qux=6 bar)', 'invocation');
    ok $th.runParserTest('foo(String, String qux?)', 'invocation');
    nok $th.runParserTest('foo(bar, baz', 'invocation', True);
    nok $th.runParserTest('foo(bar,baz)', 'invocation', True);
);

say 'Testing value';
(
    ok $th.runParserTest('$1$2$qux', 'value');
);

say 'Testing lineContents';
(
    ok $th.runParserTest('', 'lineContents');
    ok $th.runParserTest('* foo', 'lineContents');
    ok $th.runParserTest('foo', 'lineContents');
    ok $th.runParserTest('foo()', 'lineContents');
    ok $th.runParserTest('foo(bar)', 'lineContents');
    ok $th.runParserTest('foo(String, String qux, String baz)', 'lineContents');
    ok $th.runParserTest('foo(String, String qux?, *)', 'lineContents');
    ok $th.runParserTest('foo(String, String qux?, String baz)', 'lineContents');
    ok $th.runParserTest('foo(String, String qux?, String)', 'lineContents');
    ok $th.runParserTest('foo(String, String qux?)', 'lineContents');
    ok $th.runParserTest('foo(String, String, String)', 'lineContents');
    ok $th.runParserTest('foo=5', 'lineContents');
    nok $th.runParserTest('String qux?', 'lineContents', True);
);

say 'Testing TOP: Small documents';
(
    ok $th.runParserTest('', 'TOP');
    ok $th.runParserTest('foo', 'TOP');
    ok $th.runParserTest('foo()', 'TOP');
    ok $th.runParserTest('foo(bar)', 'TOP');
    ok $th.runParserTest('foo=5', 'TOP');
);

say 'Testing TOP: Larger documents';
(
    ok $th.runParserTest(q:to/♥/, 'TOP');
    String foo(String, String qux?, *):
    foo(bar baz)
    foo(qux=6 bar)
    ♥

    # ok $th.runParserTest(q:to/♥/;String foo(String, String qux?, *):
    #     say $1$2$qux
    # 
    # # Test simple invocation
    # foo(bar baz) # $1 = bar, $2 is unset, $qux = baz
    # foo(bar 6 qux) # $1 = bar, $2 = 6, $3 = qux, $qux is unset
    # foo(qux=baz bar) # $1 = bar, $qux = baz
    # 
    # # Test simple invocation, parenthesis-less style
    # foo bar baz # $1 = bar, $2 is unset, $qux = baz
    # foo bar 6 qux # $1 = bar, $2 = 6, $3 = qux, $qux is unset
    # foo qux=baz bar # $1 = bar, $qux = baz
    # 
    # # Test invocation with "invoke"
    # routineName="foo"
    # invoke $routineName bar baz
    # ♥
    # , 'TOP');
);

say "Done running tests. Report:";
done-testing;
