my $input = slurp();
my $parsed;
run-silenced { $parsed = EM.parse(); }
say $parsed.WHAT;
say XML::Writer.serialize("blah");
