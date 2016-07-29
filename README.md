= Console-in Transformer

This helps me write code to transform the contents of a file or text from stdin
into other text. The function returned by requires takes two arguments:
transform (required) and additionalDataTerminator (optional). The contents of the
file or stdin will be passed to transform as a string. If additionalDataTerminator
exists it will be appended the transformed result.

== Invocation

This code is not usable by itself as a command but does make it easy to turn a transform
function into a command. The commands have the form of 

> commandName /path/to/file

or

> cat /something/or/other | commandName -

or 

> commandName

which allows the user type/paste content.

See the package j-quote for an example of usage.