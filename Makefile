packageNameFile=package-name
packageName=`cat $(packageNameFile)`
buildsystemDir=`cat support/.buildsystemdir`

ifeq ($(PREFIX),)
    PREFIX=`cat support/.prefix`
endif
ifeq ($(datarootdir),)
    datarootdir=`cat support/.datarootdir`
endif
ifeq ($(datadir),)
    datadir=`cat support/.datadir`
endif
ifeq ($(sysconfdir),)
    sysconfdir=`cat support/.sysconfdir`
endif

all:
	@$(buildsystemDir)/support/prepare --package-name=$(packageName) --override-data-dir=$(OVERRIDEDATADIR) --destdir=$(DESTDIR) --prefix=$(prefix) --PREFIX=$(PREFIX) --exec_prefix=$(exec_prefix) --bindir=$(bindir) --datarootdir=$(datarootdir) --datadir=$(datadir) --sysconfdir=$(sysconfdir) --sharedstatedir=$(sharedstatedir)
	@echo "Done preparing" $(packageName)
install:
	@$(buildsystemDir)/support/install --package-name=$(packageName) --override-data-dir=$(OVERRIDEDATADIR) --destdir=$(DESTDIR) --prefix=$(prefix) --PREFIX=$(PREFIX) --exec_prefix=$(exec_prefix) --bindir=$(bindir) --datarootdir=$(datarootdir) --datadir=$(datadir) --sysconfdir=$(sysconfdir) --sharedstatedir=$(sharedstatedir)
	@echo "Done installing or updating" $(packageName)
noconf:
	@$(buildsystemDir)/support/install --skip-config-file --package-name=$(packageName) --override-data-dir=$(OVERRIDEDATADIR) --destdir=$(DESTDIR) --prefix=$(prefix) --PREFIX=$(PREFIX) --exec_prefix=$(exec_prefix) --bindir=$(bindir) --datarootdir=$(datarootdir) --datadir=$(datadir) --sysconfdir=$(sysconfdir) --sharedstatedir=$(sharedstatedir)
	@echo "Done installing or updating" $(packageName)
check:
	@$(buildsystemDir)/support/test --package-name=$(packageName) --override-data-dir=$(OVERRIDEDATADIR) --destdir=$(DESTDIR) --prefix=$(prefix) --PREFIX=$(PREFIX) --exec_prefix=$(exec_prefix) --bindir=$(bindir) --datarootdir=$(datarootdir) --datadir=$(datadir) --sysconfdir=$(sysconfdir) --sharedstatedir=$(sharedstatedir)
	@echo "Done running tests for" $(packageName)
autodep:
	@$(buildsystemDir)/support/autodep --package-name=$(packageName) --override-data-dir=$(OVERRIDEDATADIR) --destdir=$(DESTDIR) --prefix=$(prefix) --PREFIX=$(PREFIX) --exec_prefix=$(exec_prefix) --bindir=$(bindir) --datarootdir=$(datarootdir) --datadir=$(datadir) --sysconfdir=$(sysconfdir) --sharedstatedir=$(sharedstatedir)
	@echo "Done installing or updating dependencies for" $(packageName)

#### End of Makefile template ####

# Any package-specific Make rules go here.
