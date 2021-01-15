# Deterministic Document Computing (DDC)

This is part of the Ember project.

Learn about this project at the Ember Web site: http://futuramerlin.com/specification/engineering-and-tech/information-technology

Please report any issues you find with this repository to the Ember project's issue tracker at http://futuramerlin.com/issue-tracker/.

## Setting up and building

- Build and install dependencies: see the packaging for what's needed: https://github.com/ethus3h/ember-shared/blob/master/data/packages/ddc-in.scm
- Bootstrap and later are actively getting changed in ways that will make them probably not build sometimes or all the time.
- then the distfiles:
```
./configure -- --build-type dist; make; sudo make install
./configure -- --build-type data; make; sudo make install
./configure -- --build-type bootstrap --cache; make; sudo make install
./configure -- --build-type implementation-parts; make; sudo make install
./configure -- --build-type main; make; sudo make install
./configure -- --build-type web; make; sudo make install
./configure -- --build-type edit-webextension; make; sudo make install
./configure -- --build-type meta; make; sudo make install
```
