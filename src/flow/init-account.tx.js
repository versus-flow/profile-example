// File: ./src/flow/init-account.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function initAccount(name, description) {
  const txId = await fcl
    .send([
      // Transactions use fcl.transaction instead of fcl.script
      // Their syntax is a little different too
      fcl.transaction`
        import Profile from 0xProfile

        transaction(username: String, description: String, allowStoring: bool) {
          // We want the account's address for later so we can verify if the account was initialized properly
          let address: Address

          prepare(account: AuthAccount) {
            // save the address for the post check
            self.address = account.address

						
					  let cap= accoun.getCapability<&{Profile.Public}>(Profile.publicPath)
            // Only initialize the account if it hasn't already been initialized
            if !cap.check() {
						   let profile <-Profile.createUser(name:name, description: description, allowStoringFollowers: true, tags:[])
               account.save(<- profile, to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(35), // set the compute limit
      fcl.args([fcl.arg(name, t.String), fcl.arg(description, t.String)]),
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}

