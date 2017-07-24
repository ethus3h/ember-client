grammar REST {
    token TOP     { <slash><subject><slash><command>[<slash><data>]? }
    token subject { \w+ }
    token command { \w+ }
    token data    { .* }
 
    token slash   { \s* '/' \s* }
}
 
my $m = REST.parse('/ product / update /7 /notify');
say $m;
    
