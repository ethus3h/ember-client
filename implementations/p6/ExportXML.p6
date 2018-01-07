my $parsed = run-silenced { EM.parse(slurp()); }
say $parsed.WHAT;
say XML::Writer.serialize();
