my $input = slurp();
my $parsed;
say EM.parse($input).WHAT;
run-silenced { $parsed = EM.parse($input); }
say $parsed.WHAT;
say XML::Writer.serialize("blah");
