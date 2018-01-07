my $input = slurp();
say $input;

my $parsed;
run-silenced { $parsed = EM.parse($input); }

say $parsed.perl;


my $svg = svg => [
    :width(200), :height(200),
    circle => [
        :cx(100), :cy(100), :r(50)
    ],
];

say $svg.perl;

say XML::Writer.serialize(root => $parsed);
