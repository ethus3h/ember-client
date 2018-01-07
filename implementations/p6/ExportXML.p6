my $input = slurp();
my $parsed = "blah";
say EM.parse($input).WHAT;
do { say $parsed; }
run-silenced { $parsed = EM.parse($input); }
say $parsed.WHAT;
say XML::Writer.serialize("blah");
