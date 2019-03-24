#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys


#https://bytes.com/topic/python/answers/743965-converting-octal-escaped-utf-8-a
import re

def encode(source):
	encoded = ""
	for character in source:
		if (ord(character) < 32) or (ord(character) > 128):
			for byte in character.encode('utf8'):
				encoded += ("\%03o" % ord(byte))
		else:
			encoded += character
	return encoded.decode('utf-8')

def decode(encoded):
	decoded = encoded.encode('utf-8')
	for octc in re.findall(r'\\(\d{3})', decoded):
		decoded = decoded.replace(r'\%s' % octc, chr(int(octc, 8)))
	return decoded.decode('utf8')
	orig = u"blaÍblub" + chr(10)
	enc = encode(orig)
	dec = decode(enc)
	print orig
	print enc
	print dec

for line in sys.stdin:
    print decode(line)