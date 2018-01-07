my $parsed;
run-silenced { $parsed = EM.parse(slurp()); }
say $parsed.WHAT;
say XML::Writer.serialize();
