// File: ./src/flow/is-initialized.script.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function isInitialized(address) {
  if (address == null)
    throw new Error("isInitialized(address) -- address required")

  return fcl
    .send([
      fcl.script`
        import Profile from 0xProfile

        pub fun main(address: Address): Bool {
				 return getAccount(address)
								.getCapability<&{Profile.Public}>(Profile.publicPath)
								.check()
        }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode)
}

