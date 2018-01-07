my $input = slurp();
say $input;

my $parsed;
run-silenced { $parsed = EM.parse($input); }

say $parsed.perl;

say $parsed.tree.WHAT;

say XML::Writer.serialize($parsed.tree);
