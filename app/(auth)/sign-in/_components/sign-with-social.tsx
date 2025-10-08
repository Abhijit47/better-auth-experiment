import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

import { DiscordIcon, GitHubIcon } from '@/components/auth/oauth-icons';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { SupportedOAuthProvider } from '@/constants/oauth-providers';

interface SignWithSocialProps {
  isLoading: boolean;
  onLoading: Dispatch<SetStateAction<boolean>>;
}

export default function SignWithSocial(props: SignWithSocialProps) {
  const { isLoading, onLoading } = props;

  function handleSocialLogin(provider: SupportedOAuthProvider) {
    onLoading(true);
    switch (provider) {
      case 'github':
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
          description: 'Redirecting to GitHub...',
          descriptionClassName: 'text-[10px]',
          loading: 'Redirecting to GitHub...',
          success: 'Redirected to GitHub',
          error: 'Failed to redirect to GitHub',
          finally() {
            onLoading(false);
          },
        });
        break;
      case 'discord':
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
          description: 'Redirecting to Discord...',
          descriptionClassName: 'text-[10px]',
          loading: 'Redirecting to Discord...',
          success: 'Redirected to Discord',
          error: 'Failed to redirect to Discord',
          finally() {
            onLoading(false);
          },
        });
        break;
      default:
        toast.error('Unsupported provider');
        break;
    }
  }

  return (
    <CardContent>
      <div className={'grid grid-cols-2 gap-2'}>
        <Button
          variant='outline'
          disabled={isLoading}
          onClick={() => handleSocialLogin('github')}>
          {isLoading ? (
            <Spinner className={'size-4'} />
          ) : (
            <GitHubIcon className={'size-4'} />
          )}
        </Button>
        <Button
          variant='outline'
          disabled={isLoading}
          onClick={() => handleSocialLogin('discord')}>
          {isLoading ? (
            <Spinner className={'size-4'} />
          ) : (
            <DiscordIcon className={'size-4'} />
          )}
        </Button>
      </div>
    </CardContent>
  );
}
