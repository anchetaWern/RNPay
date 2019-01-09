<?php

namespace App\Http\Controllers;
use DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class PaymentController extends Controller
{

  public function __construct() {
    \Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));
  }


  public function createCharge(Request $request) {
    
    $amount = (int) $request->input('amount') * 100;
    $description = $request->input('description');
    $access_token = $request->input('access_token');
    $token = $request->input('token_id');

    $user = DB::table('users')
      ->where('access_token', $access_token)
      ->select('id', 'stripe_customer_id')
      ->first();

    $payment = [
      'amount' => $amount, 
      'currency' => 'usd',
      'description' => $description,
      'customer' => $user->stripe_customer_id
    ];

    if (empty($user->stripe_customer_id)) {
      // create Stripe customer and save stripe_customer_id
      try {
        $customer = \Stripe\Customer::create([
          "source" => $token 
        ]);

        DB::table('users')
          ->where('access_token', $access_token)
          ->update([
            'stripe_customer_id' => $customer->id
          ]);

        $payment['customer'] = $customer->id;
      } catch (\Exception $e) {
        Log::info("Cannot create Stripe customer for user: " . $user->id);
      }

    }

    try {
      $charge = \Stripe\Charge::create($payment);
      return ['status' => 'ok'];
    } catch (\Exception $e) {
      Log::info("Cannot create charge for Stripe customer: " . $user->id);
    }

    return ['status' => 'not_ok'];
    
  }
}
