import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  Clipboard,
  ClipboardCheckIcon,
  DownloadIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BackupCodesCardProps {
  backupCodes: string[];
  onDone: () => void;
}

export default function BackupCodesCard(props: BackupCodesCardProps) {
  const { backupCodes, onDone } = props;

  const [isCopied, setIsCopied] = useState<boolean>(false);

  function downloadTxt() {
    if (!backupCodes?.length) return;
    const blob = new Blob([backupCodes.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    if (!backupCodes?.length) return;
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast.success('Backup codes copied to clipboard');
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  }

  return (
    <Card className={'py-4 gap-4'}>
      <CardHeader>
        <CardDescription>
          <p className='text-sm text-muted-foreground mb-2'>
            Save these backup codes in a safe place. You can use them to access
            your account.
          </p>
        </CardDescription>
        <CardAction>
          <Button variant={'ghost'} size={'icon-sm'} onClick={copyToClipboard}>
            {isCopied ? (
              <ClipboardCheckIcon className={'size-4'} />
            ) : (
              <Clipboard className={'size-4'} />
            )}
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className='grid grid-cols-2 gap-2 mb-4'>
          {backupCodes.map((code, index) => (
            <div key={index} className='font-mono text-sm'>
              {index + 1} - {code}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <CardAction className={'grid grid-cols-1 md:grid-cols-2 gap-4 w-full'}>
          <Button variant='default' className={'w-full'} onClick={downloadTxt}>
            Download <DownloadIcon className={'size-4'} />
          </Button>
          <Button variant='outline' className={'w-full'} onClick={onDone}>
            Done <CheckCircle2 className={'size-4'} />
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
