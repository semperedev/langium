grammar Arithmetics

entry Module:
	'module' name=ID
	(statements+=Statement)*;

//////////////////////////////////////////////////////////////////////////////////////

A: B prop1=C (prop2=D | prop3=E);
B:
	'B' name=ID;
C:
	'C' name=ID;
D:
	'D' name=ID;
E:
	'E' name=ID;


X returns XType:
	name=ID;

type Animal = {
	x: :XType
}

type HoneyType = :Delicious | :Perfect | :Wonderful

type Bear = Animal & {
	honey: HoneyType
}

type Bee = {
	dance: :boolean
}
type BeeOrBear = Bear | Bee & {x: :string}
type BeeAndBear = Bear & Bee & {name: :string}

//////////////////////////////////////////////////////////////////////////////////////

Statement:
	Definition | Evaluation;

Definition:
	'def' name=ID ('(' args+=DeclaredParameter (',' args+=DeclaredParameter)* ')')?
	':' expr=Expression ';';

DeclaredParameter:
	name=ID;

AbstractDefinition:
	Definition | DeclaredParameter;

Evaluation:
	expression=Expression ';';

Expression:
	Addition;

Addition returns Expression:
	Multiplication ({BinaryExpression.left=current} operator=('+' | '-') right=Multiplication)*;

Multiplication returns Expression:
	PrimaryExpression ({BinaryExpression.left=current} operator=('*' | '/') right=PrimaryExpression)*;

PrimaryExpression returns Expression:
	'(' Expression ')' |
	{NumberLiteral} value=NUMBER |
	{FunctionCall} func=[AbstractDefinition] ('(' args+=Expression (',' args+=Expression)* ')')?;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal NUMBER returns number: /[0-9]+(\.[0-9])?/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
