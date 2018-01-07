my $input = slurp();
my $parsed = "blah";
say "blah".WHAT;
run-silenced { $parsed = 4; }
say $parsed.WHAT;
#say XML::Writer.serialize("blah");
