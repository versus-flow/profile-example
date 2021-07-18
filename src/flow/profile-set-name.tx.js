// File: ./src/flow/profile-set-name.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function setName(name) {
  const txId = await fcl
    .send([
      fcl.proposer(fcl.authz),
      fcl.payer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(100),
      fcl.args([fcl.arg(name, t.String)]),
      fcl.transaction`
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.User{Profile.Owner}>(from: Profile.storagePath)!
              .setName(name)
          }
        }
      `,
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}

