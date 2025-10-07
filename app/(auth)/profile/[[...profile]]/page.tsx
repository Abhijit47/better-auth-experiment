import { Key, LinkIcon, Shield, Trash2, User2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { LazyUserAccountDeletion } from './_components';
import AccountsTab from './_components/account-tab';
import ProfileCardHeading from './_components/profile-card-heading';
import ProfileTab from './_components/profile-tab';
import SecurityTab from './_components/security-tab';
import SessionsTab from './_components/sessions-tab';

export default function ProfilePage() {
  return (
    <section className={'py-8'}>
      <Card className={'min-w-3xl mx-auto w-full relative'}>
        <Link
          href={'/'}
          className={cn(
            buttonVariants({
              variant: 'link',
              size: 'sm',
              className: 'absolute top-4 right-4',
            })
          )}>
          Go back
        </Link>
        <Suspense
          fallback={
            <div className={'flex items-center justify-start gap-4 ml-4'}>
              <Skeleton className={'size-12 animate-pulse rounded-full'} />
              <div className={'space-y-2'}>
                <Skeleton className={'h-4 w-48 animate-pulse'} />
                <Skeleton className={'h-3 w-32 animate-pulse'} />
                <Skeleton className={'h-3 w-80 animate-pulse'} />
              </div>
            </div>
          }>
          <ProfileCardHeading />
        </Suspense>

        <Separator />

        <CardContent>
          <Tabs className='space-y-2' defaultValue='profile'>
            <TabsList className='grid w-full grid-cols-5'>
              <TabsTrigger value='profile'>
                <User2 />
                <span className='max-sm:hidden'>Profile</span>
              </TabsTrigger>
              <TabsTrigger value='security'>
                <Shield />
                <span className='max-sm:hidden'>Security</span>
              </TabsTrigger>
              <TabsTrigger value='sessions'>
                <Key />
                <span className='max-sm:hidden'>Sessions</span>
              </TabsTrigger>
              <TabsTrigger value='accounts'>
                <LinkIcon />
                <span className='max-sm:hidden'>Accounts</span>
              </TabsTrigger>
              <TabsTrigger value='danger'>
                <Trash2 />
                <span className='max-sm:hidden'>Danger</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='profile'>
              <Card>
                <CardContent>
                  <Suspense
                    fallback={
                      <div className={'space-y-4'}>
                        <div className={'space-y-2'}>
                          <Skeleton className={'h-3 w-20 animate-pulse'} />
                          <Skeleton className={'h-8 w-full animate-pulse'} />
                        </div>
                        <div className={'space-y-2'}>
                          <Skeleton className={'h-3 w-24 animate-pulse'} />
                          <Skeleton className={'h-8 w-full animate-pulse'} />
                        </div>
                        <div className={'space-y-2'}>
                          <Skeleton className={'h-3 w-28 animate-pulse'} />
                          <Skeleton className={'h-8 w-full animate-pulse'} />
                        </div>
                        <div className={'space-y-2'}>
                          <Skeleton className={'h-3 w-32 animate-pulse'} />
                          <Skeleton className={'h-8 w-full animate-pulse'} />
                        </div>
                        <Skeleton className={'h-8 w-full animate-pulse'} />
                      </div>
                    }>
                    <ProfileTab />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='security'>
              <Card>
                <CardContent>
                  <Suspense
                    fallback={
                      <div className={'space-y-4'}>
                        <div className={'p-6 space-y-4 border rounded-lg'}>
                          <div className={'space-y-2'}>
                            <Skeleton className={'h-4 w-32 animate-pulse'} />
                            <Skeleton className={'h-3 w-60 animate-pulse'} />
                          </div>
                          <div className={'space-y-2'}>
                            <Skeleton className={'h-3 w-32 animate-pulse'} />
                            <Skeleton className={'h-8 w-full animate-pulse'} />
                          </div>
                          <div className={'space-y-2'}>
                            <Skeleton className={'h-3 w-32 animate-pulse'} />
                            <Skeleton className={'h-8 w-full animate-pulse'} />
                          </div>
                          <div className={'space-y-2'}>
                            <Skeleton className={'h-3 w-32 animate-pulse'} />
                            <Skeleton className={'h-8 w-full animate-pulse'} />
                          </div>
                          <div className={'flex items-center gap-2'}>
                            <Skeleton className={'size-4 animate-pulse'} />
                            <Skeleton className={'h-4 w-64 animate-pulse'} />
                          </div>
                          <Skeleton className={'h-9 w-full animate-pulse'} />
                        </div>

                        <div className={'p-6 space-y-4 border rounded-lg'}>
                          <div className={'space-y-2'}>
                            <Skeleton className={'h-4 w-32 animate-pulse'} />
                            <Skeleton className={'h-3 w-96 animate-pulse'} />
                          </div>
                          <Skeleton className={'h-9 w-full animate-pulse'} />
                        </div>

                        <div className={'p-6 space-y-4 border rounded-lg'}>
                          <div className={'space-y-2'}>
                            <Skeleton className={'h-3 w-28 animate-pulse'} />
                            <Skeleton className={'h-8 w-full animate-pulse'} />
                          </div>
                          <Skeleton className={'h-9 w-full animate-pulse'} />
                        </div>
                      </div>
                    }>
                    <SecurityTab />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='sessions'>
              <Card>
                <CardContent>
                  <Suspense
                    fallback={
                      <div className={'p-4 px-5 space-y-4 rounded-lg border'}>
                        <div className={'flex items-center justify-between'}>
                          <Skeleton className={'h-3 w-48 animate-pulse'} />
                          <Skeleton className={'h-3 w-24 animate-pulse'} />
                        </div>

                        <div className={'p-4 space-y-2 rounded-lg border'}>
                          <div>
                            <Skeleton
                              className={'size-10 rounded-full animate-pulse'}
                            />
                          </div>
                          <Skeleton className={'h-3 w-36 animate-pulse'} />
                          <Skeleton className={'h-3 w-30 animate-pulse'} />
                          <Skeleton className={'h-3 w-36 animate-pulse'} />
                          <Skeleton className={'h-3 w-24 animate-pulse'} />
                          <Skeleton className={'h-2 w-48 animate-pulse'} />
                          <Skeleton className={'h-2 w-48 animate-pulse'} />
                        </div>
                      </div>
                    }>
                    <SessionsTab />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='accounts'>
              <Card>
                <CardContent>
                  <Suspense fallback={<Spinner className={'size-4'} />}>
                    <AccountsTab />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='danger'>
              <Card>
                <CardContent>
                  <LazyUserAccountDeletion />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
