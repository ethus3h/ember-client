grammar EM {
    token TOP { <line>+ }
    token line { .+ }
    token command { \w+ }
    token data    { .* }
 
    token slash   { \s* '/' \s* }
}
 
my $m = REST.parse('/ product / update /7 /notify');
say $m;
