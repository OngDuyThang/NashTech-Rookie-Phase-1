import { ParseUUIDPipe } from '@nestjs/common';

export const UUIDPipe = new ParseUUIDPipe({ version: '4' });
