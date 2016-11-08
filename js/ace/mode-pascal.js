ace.define("ace/mode/pascal_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var PascalHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = { start: 
       [ { caseInsensitive: true,
           token: 'keyword.control.pascal',
           regex: '\\b(?:(absolute|abstract|all|and|and_then|array|as|asm|attribute|begin|bindable|case|class|const|constructor|destructor|div|do|do|else|end|except|export|exports|external|far|file|finalization|finally|for|forward|goto|if|implementation|import|in|inherited|initialization|interface|interrupt|is|label|library|mod|module|name|near|nil|not|object|of|only|operator|or|or_else|otherwise|packed|pow|private|program|property|protected|public|published|qualified|record|repeat|resident|restricted|segment|set|shl|shr|then|to|try|type|unit|until|uses|value|var|view|virtual|while|with|xor))\\b' },
         { caseInsensitive: true,           
           token: 
            [ 'variable.pascal', "text",
              'storage.type.prototype.pascal',
              'entity.name.function.prototype.pascal' ],
           regex: '\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?(?=(?:\\(.*?\\))?;\\s*(?:attribute|forward|external))' },
         { caseInsensitive: true,
           token: 
            [ 'variable.pascal', "text",
              'storage.type.function.pascal',
              'entity.name.function.pascal' ],
           regex: '\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?' },
         { token: 'constant.numeric.pascal',
           regex: '\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b' },
         { token: 'punctuation.definition.comment.pascal',
           regex: '--.*$',
           push_: 
            [ { token: 'comment.line.double-dash.pascal.one',
                regex: '$',
                next: 'pop' },
              { defaultToken: 'comment.line.double-dash.pascal.one' } ] },
         { token: 'punctuation.definition.comment.pascal',
           regex: '//.*$',
           push_: 
            [ { token: 'comment.line.double-slash.pascal.two',
                regex: '$',
                next: 'pop' },
              { defaultToken: 'comment.line.double-slash.pascal.two' } ] },
         { token: 'punctuation.definition.comment.pascal',
           regex: '\\(\\*',
           push: 
            [ { token: 'punctuation.definition.comment.pascal',
                regex: '\\*\\)',
                next: 'pop' },
              { defaultToken: 'comment.block.pascal.one' } ] },
         { token: 'punctuation.definition.comment.pascal',
           regex: '\\{',
           push: 
            [ { token: 'punctuation.definition.comment.pascal',
                regex: '\\}',
                next: 'pop' },
              { defaultToken: 'comment.block.pascal.two' } ] },
         { token: 'punctuation.definition.string.begin.pascal',
           regex: '"',
           push: 
            [ { token: 'constant.character.escape.pascal', regex: '\\\\.' },
              { token: 'punctuation.definition.string.end.pascal',
                regex: '"',
                next: 'pop' },
              { defaultToken: 'string.quoted.double.pascal' } ]
           //Double quoted strings are an extension and (generally) support C-style escape sequences.
            },
         { token: 'punctuation.definition.string.begin.pascal',
           regex: '\'',
           push: 
            [ { token: 'constant.character.escape.apostrophe.pascal',
                regex: '\'\'' },
              { token: 'punctuation.definition.string.end.pascal',
                regex: '\'',
                next: 'pop' },
              { defaultToken: 'string.quoted.single.pascal' } ] },
          { token: 'keyword.operator',
           regex: '[+\\-;,/*%]|:=|=' } ] }
    
    this.normalizeRules();
};

oop.inherits(PascalHighlightRules, TextHighlightRules);

exports.PascalHighlightRules = PascalHighlightRules;
});