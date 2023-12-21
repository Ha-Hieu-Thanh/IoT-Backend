import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'ISOString', async: false })
export class CustomISOString implements ValidatorConstraintInterface {
  validate(dateTimeString: string, args: ValidationArguments) {
    try {
      const ISOStringRegex = new RegExp(
        '^\\d\\d\\d\\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9].[0-9][0-9][0-9])Z$',
      );
      const isIOSString = ISOStringRegex.test(dateTimeString);
      const date = new Date(dateTimeString).toISOString();

      return isIOSString && date === dateTimeString;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} must be ISOString `;
  }
}
