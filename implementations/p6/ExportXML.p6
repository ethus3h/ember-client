my $input = slurp();
my $parsed;
run-silenced { $parsed = EM.parse($input); }
say $parsed.WHAT;
say XML::Writer.serialize("blah");
