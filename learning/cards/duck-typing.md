---
id: duck-typing
title: Duck Typing
emoji: 🦆
category: Python / Type System
type: low-frequency
---

# Duck Typing

## One-Line Essence

> If it walks like a duck and quacks like a duck, it's a duck

## Use When

Care about behavior, not type inheritance

## Typical Cases

- Functions expecting objects with .read(), .write() methods
- Accepting any object that "acts like" a list/dict without requiring inheritance
- Plugin systems where you want flexible interfaces

## Example

```python
# Duck typing - no need for inheritance
class FileLogger:
    def write(self, msg):
        with open('log.txt', 'a') as f:
            f.write(msg)

class ConsoleLogger:
    def write(self, msg):
        print(msg)

class EmailLogger:
    def write(self, msg):
        # Send email with the message
        send_email(to="admin@example.com", body=msg)

def log_message(logger, message):
    # Works with ANY object that has write() method
    # Doesn't care about the class hierarchy
    logger.write(message)

# All three work - "if it has write(), it's a logger"
log_message(FileLogger(), "Error occurred")
log_message(ConsoleLogger(), "Error occurred")
log_message(EmailLogger(), "Critical alert")

# Real-world example: file-like objects
def process_data(file_obj):
    # Works with real files, StringIO, BytesIO, etc.
    data = file_obj.read()
    return data.upper()

from io import StringIO
process_data(open('data.txt'))      # Real file
process_data(StringIO("hello"))     # String buffer
```

## Risks

Runtime error if method missing - no compile-time type checking

## When NOT to Use

When you need compile-time type checking or clear interfaces for large teams

## Related Concepts

- Protocol (Python 3.8+)
- Abstract Base Classes
- Structural typing
- EAFP principle
