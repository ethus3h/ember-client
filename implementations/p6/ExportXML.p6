my $input = slurp();
say $input;
say $input.WHAT;
say EM.parse($input).WHAT;
my $parsed;
run-silenced { $parsed = EM.parse($input); }
say $parsed.WHAT;
say XML::Writer.serialize("blah");
