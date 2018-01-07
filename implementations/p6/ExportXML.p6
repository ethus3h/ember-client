my $input = slurp();
say $input;

my $parsed;
run-silenced { $parsed = EM.parse($input); }

$parsed = root => [
    :width(200), :height(200),
    circle => [
        :cx(100), :cy(100), :r(50)
    ],
];

say $parsed.WHAT;

say XML::Writer.serialize($parsed);
