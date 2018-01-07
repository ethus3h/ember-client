my $input = slurp();
say $input;

my $parsed;
run-silenced { $parsed = EM.parse($input); }
say $parsed;

say XML::Writer.serialize($parsed);
