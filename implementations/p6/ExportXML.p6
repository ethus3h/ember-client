my $input = slurp();
my $parsed = "blah";
say EM.parse("say").WHAT;
do { say $parsed; }
run-silenced { $parsed = EM.parse($input); }
say $parsed.WHAT;
say XML::Writer.serialize("blah");
