'use client';

import * as React from 'react';
// import { useId, useState } from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

export default function InputWithPasswordVisible({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  const [isVisible, setIsVisible] = React.useState(false);

  const id = React.useId();

  return (
    // <div className='w-full max-w-xs space-y-2'>
    //   <Label htmlFor={id}>Password input</Label>
    <div className='relative'>
      <Input
        id={id}
        type={isVisible ? 'text' : 'password'}
        placeholder='Password'
        className='pr-9'
        {...props}
      />
      <Button
        type='button'
        variant='secondary'
        size='icon'
        onClick={() => setIsVisible((prevState) => !prevState)}
        className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'>
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        <span className='sr-only'>
          {isVisible ? 'Hide password' : 'Show password'}
        </span>
      </Button>
    </div>
    // </div>
  );
}
