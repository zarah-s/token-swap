// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.2;
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Token.sol";

error INVALID_LIQUIDITY();
error ONLY_OWNER();

contract Swap {
    address public owner;
    address[2] tokenAddresses;
    struct TokenDetails {
        uint rate;
        Token token;
    }

    uint exchangeRate = 2;

    mapping(address => TokenDetails) token;

    constructor(address tokenA, address tokenB) {
        owner = msg.sender;
        // Token tokenA = new Token("PYPERCOIN", "PPC");
        // Token tokenB = new Token("PYPERCOINB", "PPCB");
        token[address(tokenA)] = TokenDetails(1, Token(tokenA));
        token[address(tokenB)] = TokenDetails(2, Token(tokenB));
        tokenAddresses[0] = address(tokenA);
        tokenAddresses[1] = address(tokenB);
    }

    function getTokenAddresses() external view returns (address[2] memory) {
        return tokenAddresses;
    }

    function swapToken(
        address _currentToken,
        uint _amount,
        address _receivingToken
    ) external {
        TokenDetails memory currentToken = token[_currentToken];
        TokenDetails memory receivingToken = token[_receivingToken];

        require(
            currentToken.token.balanceOf(msg.sender) >= _amount * 10 ** 18,
            "Insufficient Balance"
        );
        uint calculatedRate = calculatedOutgoingToken(_currentToken, _amount);
        require(
            receivingToken.token.balanceOf(address(this)) >= calculatedRate,
            "No tokens available to be swapped"
        );

        require(
            currentToken.token.transferFrom(
                msg.sender,
                address(this),
                _amount * 10 ** 18
            ),
            "OOPS!! Something went wrong"
        );
        receivingToken.token.transfer(msg.sender, calculatedRate);
    }

    function calculatedOutgoingToken(
        address _currentToken,
        uint amount
    ) internal view returns (uint) {
        TokenDetails memory currentToken = token[_currentToken];
        if (currentToken.rate == 1) {
            return (2 * 10 ** 18) * amount;
        } else {
            return (1 * 10 ** 18) * amount;
        }
    }
}
