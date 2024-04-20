import { getPaginatedUsers } from '@/actions';
import { Title } from '@/components';

import { UsersTable } from './ui/UsersTable';

export default async function UsersAdminPage() {

  const { ok, users = [] } = await getPaginatedUsers();

  return (
    <>
      <Title title="Todos los usuarios" />

      <div className="mb-10">
        <UsersTable users={ users }/>
      </div>
    </>
  );
}