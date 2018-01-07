my $input = slurp();
say EM.parse("say").WHAT;
do { say $parsed; }
run-silenced { $parsed = EM.parse($input); }
say $parsed.WHAT;
say XML::Writer.serialize("blah");
